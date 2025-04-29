'use client';

import type { ChangeEvent } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCurrentLocation, type Location } from '@/services/location';
import { classifyTrash, type ClassifyTrashInput, type ClassifyTrashOutput } from '@/ai/flows/classify-trash';
import { Camera, MapPin, Trash2, Package, Bot, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

// Define a type for the identified trash item
interface TrashItem extends ClassifyTrashOutput {
  id: string;
  imageUrl: string;
}

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [identifiedTrash, setIdentifiedTrash] = useState<TrashItem[]>([]);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch current location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Could not fetch location. Please ensure location services are enabled.');
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not fetch location. Please ensure location services are enabled.",
        });
      } finally {
        setLoadingLocation(false);
      }
    };
    fetchLocation();
  }, [toast]);

  // Handle image selection from file input
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(URL.createObjectURL(file)); // For display
        setImageDataUri(dataUri); // For sending to AI
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Classify trash using the AI flow
  const handleClassifyTrash = async () => {
    if (!imageDataUri) {
      toast({
        variant: "destructive",
        title: "No Image",
        description: "Please capture or select an image first.",
      });
      return;
    }

    setIsClassifying(true);
    setError(null);

    try {
      const input: ClassifyTrashInput = { photoDataUri: imageDataUri };
      const result = await classifyTrash(input);

      const newTrashItem: TrashItem = {
        ...result,
        id: new Date().toISOString(), // Simple unique ID
        imageUrl: imagePreview!, // Use the preview URL for display
      };

      setIdentifiedTrash(prev => [newTrashItem, ...prev]); // Add to the beginning of the list
      setImagePreview(null); // Clear preview after classification
      setImageDataUri(null); // Clear data URI
       toast({
        title: "Trash Classified!",
        description: `Identified as: ${result.trashType} (Confidence: ${(result.confidence * 100).toFixed(0)}%)`,
      });
    } catch (err) {
      console.error('Error classifying trash:', err);
      setError('Failed to classify trash. Please try again.');
      toast({
        variant: "destructive",
        title: "Classification Failed",
        description: "Could not classify the trash item. Please try again.",
      });
    } finally {
      setIsClassifying(false);
    }
  };

   // Placeholder icon for trash types
   const getTrashIcon = (trashType: string) => {
    // In a real app, you'd map trashType to specific icons
    const lowerType = trashType.toLowerCase();
    if (lowerType.includes('bottle') || lowerType.includes('plastic')) {
      return <Package className="h-5 w-5 text-blue-500" />;
    } else if (lowerType.includes('can') || lowerType.includes('metal')) {
      return <Trash2 className="h-5 w-5 text-gray-500" />;
    } else if (lowerType.includes('paper') || lowerType.includes('cardboard')) {
       // Simple SVG for paper/cardboard as lucide doesn't have a direct match
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-600">
          <path d="M4 4v16h16V4H4zm4 4h8m-8 4h8m-8 4h4"/>
        </svg>
      )
    }
    // Default icon
    return <Trash2 className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">BeachWise</h1>
        <div className="flex items-center gap-2 text-sm text-foreground">
          {loadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : location ? (
            <>
              <MapPin className="h-4 w-4 text-accent" />
              <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </>
          ) : (
            <span className="text-destructive">{error || 'Location unavailable'}</span>
          )}
        </div>
      </header>

      {/* Camera and Classification Section */}
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Camera className="h-6 w-6 text-accent" />
             Log Trash
          </CardTitle>
          <CardDescription>Capture an image of the trash you found.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {imagePreview ? (
            <div className="relative w-full max-w-sm h-64 border border-dashed border-border rounded-lg overflow-hidden">
               <Image src={imagePreview} alt="Trash preview" layout="fill" objectFit="cover" />
            </div>
          ) : (
             <div className="w-full max-w-sm h-64 border border-dashed border-border rounded-lg flex flex-col justify-center items-center bg-muted/50">
                <Camera className="h-16 w-16 text-muted-foreground mb-2"/>
                <p className="text-muted-foreground text-center">Tap the camera button below to start</p>
             </div>
          )}

           {/* Hidden file input */}
           <Input
            type="file"
            accept="image/*"
            capture="environment" // Prioritize back camera on mobile
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex gap-4 w-full max-w-sm">
            <Button onClick={handleCameraClick} className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground" aria-label="Capture or select image">
                <Camera className="mr-2 h-5 w-5" /> {imagePreview ? 'Retake' : 'Capture'}
            </Button>
            <Button
              onClick={handleClassifyTrash}
              disabled={!imagePreview || isClassifying}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              aria-label="Classify trash"
            >
              {isClassifying ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Bot className="mr-2 h-5 w-5" />
              )}
              Classify
            </Button>
          </div>
          {error && <p className="text-destructive text-center mt-2">{error}</p>}
        </CardContent>
      </Card>

       {/* Identified Trash List */}
        {identifiedTrash.length > 0 && (
            <Card className="flex-1 shadow-md overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trash2 className="h-6 w-6 text-accent" />
                        Identified Trash
                    </CardTitle>
                    <CardDescription>Trash items you've logged so far in this session.</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-8rem)] overflow-y-auto p-0"> {/* Adjust height and padding */}
                    <ul className="divide-y divide-border">
                        {identifiedTrash.map((item) => (
                            <li key={item.id} className="flex items-center p-4 gap-4 hover:bg-muted/50 transition-colors">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border border-border">
                                    <Image src={item.imageUrl} alt={item.trashType} layout="fill" objectFit="cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {getTrashIcon(item.trashType)}
                                        <span className="font-medium text-foreground">{item.trashType}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Confidence: <span className="font-semibold">{(item.confidence * 100).toFixed(0)}%</span>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

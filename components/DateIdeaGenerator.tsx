'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { TextInput, Textarea } from './TextInput';
import { LoadingSpinner } from './LoadingSpinner';
import { generateDateIdeas } from '@/lib/ai';
import { validateDateIdeaInput } from '@/lib/utils';
import { MapPin, Clock, DollarSign, Heart, RefreshCw } from 'lucide-react';

interface DateIdeaItem {
  title: string;
  description: string;
  category: string;
  estimatedCost: string;
  duration: string;
}

export function DateIdeaGenerator() {
  const [formData, setFormData] = useState({
    interests: '',
    location: '',
    vibe: '',
    budget: '',
  });
  
  const [generatedIdeas, setGeneratedIdeas] = useState<DateIdeaItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    
    const interests = formData.interests.split(',').map(i => i.trim()).filter(i => i);
    
    const validation = validateDateIdeaInput({
      interests,
      location: formData.location,
      vibe: formData.vibe,
    });
    
    if (validation) {
      setError(validation);
      return;
    }

    setIsGenerating(true);
    
    try {
      const ideas = await generateDateIdeas({
        interests,
        location: formData.location,
        vibe: formData.vibe,
        budget: formData.budget || undefined,
      });
      
      setGeneratedIdeas(ideas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate date ideas');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <Heart className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-text">Personalized Date Ideas</h2>
        </div>
        
        <div className="space-y-4">
          <TextInput
            label="Shared Interests (comma-separated)"
            placeholder="art, music, food, nature, sports..."
            value={formData.interests}
            onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
          />
          
          <TextInput
            label="Location/City"
            placeholder="San Francisco, CA"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <Textarea
            label="Desired Date Vibe"
            placeholder="Romantic and intimate, adventurous and active, casual and fun..."
            value={formData.vibe}
            onChange={(e) => setFormData(prev => ({ ...prev, vibe: e.target.value }))}
            rows={3}
          />
          
          <TextInput
            label="Budget Range (optional)"
            placeholder="Free, $, $$, $$$"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
          />
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? 'Creating Perfect Date Ideas...' : 'Generate Date Ideas'}
          </Button>
        </div>
      </Card>

      {generatedIdeas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text">Your Personalized Date Ideas</h3>
          <div className="grid gap-4">
            {generatedIdeas.map((idea, index) => (
              <Card key={index} variant="elevated">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-text">{idea.title}</h4>
                      <span className="inline-block px-2 py-1 bg-accent bg-opacity-10 text-accent text-xs rounded-full mt-1">
                        {idea.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">{idea.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{idea.estimatedCost}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{idea.duration}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Button
            variant="secondary"
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="w-full flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate New Ideas</span>
          </Button>
        </div>
      )}
    </div>
  );
}

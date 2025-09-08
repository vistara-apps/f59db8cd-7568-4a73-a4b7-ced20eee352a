'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card } from './Card';
import { Button } from './Button';
import { TextInput, Textarea } from './TextInput';
import { LoadingSpinner } from './LoadingSpinner';
import { PaymentModal } from './PaymentModal';
import { generateDateIdeas } from '@/lib/ai';
import { validateDateIdeaInput } from '@/lib/utils';
import { paymentService } from '@/lib/payment';
import { MapPin, Clock, DollarSign, Heart, RefreshCw, CreditCard } from 'lucide-react';

interface DateIdeaItem {
  title: string;
  description: string;
  category: string;
  estimatedCost: string;
  duration: string;
}

export function DateIdeaGenerator() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    interests: '',
    location: '',
    vibe: '',
    budget: '',
  });
  
  const [generatedIdeas, setGeneratedIdeas] = useState<DateIdeaItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    
    // Check wallet connection
    if (!isConnected || !address) {
      setError('Please connect your wallet to generate date ideas');
      return;
    }
    
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

    // Show payment modal for new generations
    setPendingGeneration(true);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!pendingGeneration) return;
    
    setIsGenerating(true);
    setPendingGeneration(false);
    
    try {
      const interests = formData.interests.split(',').map(i => i.trim()).filter(i => i);
      
      // Use API route instead of direct AI call for production
      const response = await fetch('/api/generate-date-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests,
          location: formData.location,
          vibe: formData.vibe,
          budget: formData.budget || undefined,
          walletAddress: address,
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate date ideas');
      }
      
      const ideas = result.data;
      
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
            disabled={isGenerating || !isConnected}
          >
            {isGenerating ? (
              'Creating Perfect Date Ideas...'
            ) : !isConnected ? (
              'Connect Wallet to Generate'
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Generate Date Ideas ({paymentService.formatCost('dateIdeas')})
              </>
            )}
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

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingGeneration(false);
        }}
        serviceType="dateIdeas"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

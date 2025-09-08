'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card } from './Card';
import { Button } from './Button';
import { TextInput, Textarea } from './TextInput';
import { LoadingSpinner } from './LoadingSpinner';
import { PaymentModal } from './PaymentModal';
import { generateDatingBio } from '@/lib/ai';
import { validateBioInput } from '@/lib/utils';
import { paymentService } from '@/lib/payment';
import { Copy, RefreshCw, Sparkles, CreditCard } from 'lucide-react';

export function BioGenerator() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    interests: '',
    personalityTraits: '',
    lookingFor: '',
    age: '',
  });
  
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    
    // Check wallet connection
    if (!isConnected || !address) {
      setError('Please connect your wallet to generate bios');
      return;
    }
    
    const interests = formData.interests.split(',').map(i => i.trim()).filter(i => i);
    const personalityTraits = formData.personalityTraits.split(',').map(t => t.trim()).filter(t => t);
    
    const validation = validateBioInput({
      interests,
      personalityTraits,
      lookingFor: formData.lookingFor,
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
      const personalityTraits = formData.personalityTraits.split(',').map(t => t.trim()).filter(t => t);
      
      // Use API route instead of direct AI call for production
      const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests,
          personalityTraits,
          lookingFor: formData.lookingFor,
          age: formData.age ? parseInt(formData.age) : undefined,
          walletAddress: address,
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate bios');
      }
      
      const bios = result.data;
      
      setGeneratedBios(bios);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate bios');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (bio: string, index: number) => {
    try {
      await navigator.clipboard.writeText(bio);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-text">AI Bio Generator</h2>
        </div>
        
        <div className="space-y-4">
          <TextInput
            label="Your Interests (comma-separated)"
            placeholder="hiking, photography, cooking, travel..."
            value={formData.interests}
            onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
          />
          
          <TextInput
            label="Personality Traits (comma-separated)"
            placeholder="adventurous, funny, thoughtful, creative..."
            value={formData.personalityTraits}
            onChange={(e) => setFormData(prev => ({ ...prev, personalityTraits: e.target.value }))}
          />
          
          <Textarea
            label="What are you looking for?"
            placeholder="Someone who shares my love for adventure and deep conversations..."
            value={formData.lookingFor}
            onChange={(e) => setFormData(prev => ({ ...prev, lookingFor: e.target.value }))}
            rows={3}
          />
          
          <TextInput
            label="Age (optional)"
            type="number"
            placeholder="25"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
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
              'Generating Your Perfect Bios...'
            ) : !isConnected ? (
              'Connect Wallet to Generate'
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Generate Dating Bios ({paymentService.formatCost('bio')})
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedBios.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text">Your Generated Bios</h3>
          {generatedBios.map((bio, index) => (
            <Card key={index} variant="elevated">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-primary">Bio Option {index + 1}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(bio, index)}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedIndex === index ? 'Copied!' : 'Copy'}</span>
                  </Button>
                </div>
                <p className="text-text leading-relaxed">{bio}</p>
              </div>
            </Card>
          ))}
          
          <Button
            variant="secondary"
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="w-full flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate New Variations</span>
          </Button>
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingGeneration(false);
        }}
        serviceType="bio"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

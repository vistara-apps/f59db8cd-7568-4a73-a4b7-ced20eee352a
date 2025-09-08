'use client';

import { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { getBioGenerations, getDateIdeaGenerations, BioGeneration, DateIdeaGeneration } from '@/lib/storage';
import { useAccount } from 'wagmi';
import { History, Copy, Calendar, Sparkles, Heart } from 'lucide-react';

export function GenerationHistory() {
  const { address } = useAccount();
  const [bioHistory, setBioHistory] = useState<BioGeneration[]>([]);
  const [dateHistory, setDateHistory] = useState<DateIdeaGeneration[]>([]);
  const [activeTab, setActiveTab] = useState<'bios' | 'dates'>('bios');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setBioHistory(getBioGenerations(address));
      setDateHistory(getDateIdeaGenerations(address));
    }
  }, [address]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!address) {
    return (
      <Card>
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Connect your wallet to view generation history</p>
        </div>
      </Card>
    );
  }

  const hasHistory = bioHistory.length > 0 || dateHistory.length > 0;

  if (!hasHistory) {
    return (
      <Card>
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No History Yet</h3>
          <p className="text-gray-600">Your generated bios and date ideas will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-text">Generation History</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-surface rounded-lg p-1 border border-gray-100 mb-6">
          <Button
            variant={activeTab === 'bios' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('bios')}
            className="flex-1"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Bios ({bioHistory.length})
          </Button>
          <Button
            variant={activeTab === 'dates' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('dates')}
            className="flex-1"
          >
            <Heart className="w-4 h-4 mr-2" />
            Date Ideas ({dateHistory.length})
          </Button>
        </div>

        {/* Bio History */}
        {activeTab === 'bios' && (
          <div className="space-y-4">
            {bioHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No bio generations yet</p>
            ) : (
              bioHistory.map((generation) => (
                <Card key={generation.id} variant="elevated">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(generation.timestamp)}
                        </span>
                      </div>
                      <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                        {generation.generatedBios.length} bios
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Interests:</strong> {generation.input.interests.join(', ')}</p>
                      <p><strong>Traits:</strong> {generation.input.personalityTraits.join(', ')}</p>
                      <p><strong>Looking for:</strong> {generation.input.lookingFor}</p>
                    </div>

                    <div className="space-y-3">
                      {generation.generatedBios.map((bio, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium text-primary">Bio {index + 1}</span>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => copyToClipboard(bio, `${generation.id}-${index}`)}
                              className="flex items-center space-x-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedIndex === `${generation.id}-${index}` ? 'Copied!' : 'Copy'}</span>
                            </Button>
                          </div>
                          <p className="text-sm text-text leading-relaxed">{bio}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Date Ideas History */}
        {activeTab === 'dates' && (
          <div className="space-y-4">
            {dateHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No date idea generations yet</p>
            ) : (
              dateHistory.map((generation) => (
                <Card key={generation.id} variant="elevated">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(generation.timestamp)}
                        </span>
                      </div>
                      <span className="text-xs bg-accent bg-opacity-10 text-accent px-2 py-1 rounded-full">
                        {generation.generatedIdeas.length} ideas
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><strong>Interests:</strong> {generation.input.interests.join(', ')}</p>
                      <p><strong>Location:</strong> {generation.input.location}</p>
                      <p><strong>Vibe:</strong> {generation.input.vibe}</p>
                      {generation.input.budget && <p><strong>Budget:</strong> {generation.input.budget}</p>}
                    </div>

                    <div className="grid gap-3">
                      {generation.generatedIdeas.map((idea, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-text text-sm">{idea.title}</h4>
                              <span className="inline-block px-2 py-1 bg-accent bg-opacity-10 text-accent text-xs rounded-full mt-1">
                                {idea.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-2">{idea.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>💰 {idea.estimatedCost}</span>
                            <span>⏱️ {idea.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

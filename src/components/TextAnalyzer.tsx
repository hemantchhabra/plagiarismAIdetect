import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Brain, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SegmentType = 'original' | 'ai-generated' | 'plagiarized' | 'uncertain';

interface AnalysisResult {
  overall: {
    originalScore: number;
    aiScore: number;
    plagiarismScore: number;
  };
  segments: Array<{
    text: string;
    type: SegmentType;
    confidence: number;
    sources?: string[];
  }>;
}

export const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  // Mock analysis function - in real app would call APIs
  const analyzeText = async (inputText: string): Promise<AnalysisResult> => {
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis results
    const words = inputText.split(/\s+/);
    const segments: AnalysisResult['segments'] = [];
    
    let currentSegment = '';
    let segmentTypeIndex = 0;
    const types: SegmentType[] = ['original', 'ai-generated', 'plagiarized', 'uncertain'];
    
    words.forEach((word, index) => {
      currentSegment += (currentSegment ? ' ' : '') + word;
      
      // Change segment type every 15-25 words for demo
      if (index > 0 && (index % Math.floor(Math.random() * 10 + 15)) === 0) {
        const currentType = types[segmentTypeIndex % types.length];
        const sources = currentType === 'plagiarized' 
          ? ['example.com', 'wikipedia.org'] 
          : undefined;
        
        segments.push({
          text: currentSegment,
          type: currentType,
          confidence: Math.random() * 0.4 + 0.6, // 60-100%
          sources
        });
        
        // Cycle through types
        segmentTypeIndex = Math.floor(Math.random() * types.length);
        currentSegment = '';
      }
    });
    
    // Add remaining text
    if (currentSegment) {
      const currentType = types[segmentTypeIndex % types.length];
      const sources = currentType === 'plagiarized' ? ['example.com'] : undefined;
      
      segments.push({
        text: currentSegment,
        type: currentType,
        confidence: Math.random() * 0.4 + 0.6,
        sources
      });
    }

    // Calculate overall scores
    const totalLength = segments.reduce((sum, seg) => sum + seg.text.length, 0);
    let originalLength = 0, aiLength = 0, plagiarismLength = 0;
    
    segments.forEach(seg => {
      switch (seg.type) {
        case 'original':
          originalLength += seg.text.length;
          break;
        case 'ai-generated':
          aiLength += seg.text.length;
          break;
        case 'plagiarized':
          plagiarismLength += seg.text.length;
          break;
        default:
          break;
      }
    });

    return {
      overall: {
        originalScore: Math.round((originalLength / totalLength) * 100),
        aiScore: Math.round((aiLength / totalLength) * 100),
        plagiarismScore: Math.round((plagiarismLength / totalLength) * 100)
      },
      segments
    };
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
      toast({
        title: "Analysis complete",
        description: "Text analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSegmentStyle = (type: SegmentType) => {
    switch (type) {
      case 'ai-generated':
        return 'bg-ai-generated/20 border-l-4 border-l-ai-generated';
      case 'plagiarized':
        return 'bg-plagiarized/20 border-l-4 border-l-plagiarized';
      case 'original':
        return 'bg-original/20 border-l-4 border-l-original';
      case 'uncertain':
        return 'bg-uncertain/20 border-l-4 border-l-uncertain';
      default:
        return 'bg-muted';
    }
  };

  const getTypeLabel = (type: SegmentType) => {
    switch (type) {
      case 'ai-generated':
        return 'AI Generated';
      case 'plagiarized':
        return 'Plagiarized';
      case 'original':
        return 'Original';
      case 'uncertain':
        return 'Uncertain';
      default:
        return 'Unknown';
    }
  };

  const getTypeColor = (type: SegmentType) => {
    switch (type) {
      case 'ai-generated':
        return 'bg-ai-generated text-ai-generated-foreground';
      case 'plagiarized':
        return 'bg-plagiarized text-plagiarized-foreground';
      case 'original':
        return 'bg-original text-original-foreground';
      case 'uncertain':
        return 'bg-uncertain text-uncertain-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-analysis p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Text Authenticity Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Detect AI-generated content and potential plagiarism in your text. 
            Get detailed analysis with highlighted sections and confidence scores.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Input Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your blog content here for analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] text-sm"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {text.length} characters
                </span>
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !text.trim()}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {isAnalyzing ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Text
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Analysis Results
                </span>
                {result && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Analyzing text for AI generation and plagiarism...
                  </div>
                  <Progress value={66} className="w-full" />
                </div>
              )}

              {result && (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed</TabsTrigger>
                    <TabsTrigger value="sources">Sources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Original Content</span>
                          <Badge className={getTypeColor('original')}>
                            {result.overall.originalScore}%
                          </Badge>
                        </div>
                        <Progress value={result.overall.originalScore} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">AI Generated</span>
                          <Badge className={getTypeColor('ai-generated')}>
                            {result.overall.aiScore}%
                          </Badge>
                        </div>
                        <Progress value={result.overall.aiScore} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Potentially Plagiarized</span>
                          <Badge className={getTypeColor('plagiarized')}>
                            {result.overall.plagiarismScore}%
                          </Badge>
                        </div>
                        <Progress value={result.overall.plagiarismScore} className="h-2" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="detailed" className="space-y-4">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {result.segments.map((segment, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${getSegmentStyle(segment.type)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getTypeColor(segment.type)} variant="secondary">
                              {getTypeLabel(segment.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(segment.confidence * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-sm">{segment.text}</p>
                          {segment.sources && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Similar to: {segment.sources.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="sources" className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Potential sources found for plagiarized content:
                    </div>
                    <div className="space-y-2">
                      {result.segments
                        .filter(seg => seg.sources)
                        .map((segment, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="font-medium text-sm mb-1">
                              Sources: {segment.sources?.join(', ')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              "{segment.text.substring(0, 100)}..."
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {!result && !isAnalyzing && (
                <div className="text-center text-muted-foreground py-12">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter text and click "Analyze Text" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
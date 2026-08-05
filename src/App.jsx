import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import JobProgressCard from './components/JobProgressCard';
import VideoPlayerCard from './components/VideoPlayerCard';
import HistoryView from './components/HistoryView';
import ColabScriptView from './components/ColabScriptView';
import SettingsModal from './components/SettingsModal';

import {
  getStoredColabUrl,
  saveColabUrl,
  getStoredHistory,
  saveHistoryItem,
  clearHistory,
  deleteHistoryItem,
} from './services/storage';

import {
  checkHealth,
  submitJob,
  fetchJobStatus,
  cancelJob,
  getJobVideoUrl,
} from './services/api';

export default function App() {
  // Navigation & Settings
  const [activeTab, setActiveTab] = useState('generate');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [colabUrl, setColabUrl] = useState(getStoredColabUrl());
  const [isConnected, setIsConnected] = useState(false);

  // Active Job State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentModel, setCurrentModel] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);

  // Local History List
  const [historyList, setHistoryList] = useState(getStoredHistory());

  const pollIntervalRef = useRef(null);

  // Initial Health Check on load or URL change
  useEffect(() => {
    if (!colabUrl) {
      setIsConnected(false);
      return;
    }

    let isMounted = true;
    checkHealth(colabUrl)
      .then(() => {
        if (isMounted) setIsConnected(true);
      })
      .catch(() => {
        if (isMounted) setIsConnected(false);
      });

    return () => {
      isMounted = false;
    };
  }, [colabUrl]);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleSaveColabUrl = (newUrl) => {
    setColabUrl(newUrl);
    saveColabUrl(newUrl);
  };

  // Helper to append timestamped Bangla logs
  const appendLog = (msg) => {
    const timeStr = new Date().toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].msg === msg) {
        return prev;
      }
      return [...prev, { time: timeStr, msg }];
    });
  };

  // Submit New Job
  const handleStartGeneration = async (jobPayload) => {
    if (!colabUrl) {
      setIsSettingsOpen(true);
      return;
    }

    setIsGenerating(true);
    setJobStatus({ status: 'Processing', progress: 5, message: '⏳ অনুরোধ পাঠানো হচ্ছে...' });
    setLogs([]);
    setCurrentPrompt(`${jobPayload.destination} (${jobPayload.vibe}) - ${jobPayload.offer_text}`);
    setCurrentModel(jobPayload.video_model);
    setVideoUrl(null);

    appendLog(`⏳ ${jobPayload.destination} এর জন্য ফ্লাইট টিকিট প্রমো তৈরি করা শুরু হচ্ছে...`);

    try {
      const jobId = await submitJob(colabUrl, jobPayload);
      setActiveJobId(jobId);
      appendLog('✅ অনুরোধ সফলভাবে রিসিভ করা হয়েছে। জব আইডি: ' + jobId.slice(0, 8));

      // Start Polling every 3.5 seconds
      pollIntervalRef.current = setInterval(() => {
        pollJob(jobId, jobPayload.destination, jobPayload.video_model);
      }, 3500);
    } catch (err) {
      setIsGenerating(false);
      setIsConnected(false);
      setJobStatus({
        status: 'Failed',
        progress: 0,
        message: err.message || '❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান',
      });
      appendLog(err.message || '❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
    }
  };

  // Stop / Cancel Running Job
  const handleStopJob = async () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    appendLog('🛑 ভিডিও জেনারেশন থামানোর নির্দেশ পাঠানো হয়েছে...');
    
    if (activeJobId && colabUrl) {
      await cancelJob(colabUrl, activeJobId);
    }

    setIsGenerating(false);
    setJobStatus({
      status: 'Failed',
      progress: 0,
      message: '🛑 ব্যবহারকারী ভিডিও জেনারেশন থামিয়ে দিয়েছেন।',
    });
  };

  // Poll Job Status
  const pollJob = async (jobId, destinationName, modelName) => {
    try {
      const statusData = await fetchJobStatus(colabUrl, jobId);
      setJobStatus(statusData);
      setIsConnected(true);

      if (statusData.message) {
        appendLog(statusData.message);
      }

      if (statusData.status === 'Completed') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setIsGenerating(false);

        const finalVideoUrl = getJobVideoUrl(colabUrl, jobId);
        setVideoUrl(finalVideoUrl);

        // Add to local history storage
        const historyItem = {
          id: jobId,
          prompt: currentPrompt || destinationName,
          model: modelName,
          timestamp: Date.now(),
          videoUrl: finalVideoUrl,
        };
        const updated = saveHistoryItem(historyItem);
        setHistoryList(updated);

        appendLog('✅ ভিডিও তৈরি সম্পূর্ণরূপে সফল হয়েছে!');
      } else if (statusData.status === 'Failed') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setIsGenerating(false);
        appendLog('❌ জেনারেশন বন্ধ বা ব্যর্থ হয়েছে: ' + statusData.message);
      }
    } catch (err) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setIsGenerating(false);
      setIsConnected(false);
      setJobStatus({
        status: 'Failed',
        progress: 0,
        message: '❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান',
      });
      appendLog('❌ Colab সার্ভার connected নেই — notebook চালিয়ে নতুন URL সেটিংসে বসান');
    }
  };

  const handleResetGeneration = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setIsGenerating(false);
    setActiveJobId(null);
    setJobStatus(null);
    setLogs([]);
    setVideoUrl(null);
  };

  const handleSelectHistory = (item) => {
    setCurrentPrompt(item.prompt);
    setCurrentModel(item.model);
    setVideoUrl(item.videoUrl);
    setActiveTab('generate');
  };

  const handleDeleteHistory = (id) => {
    const updated = deleteHistoryItem(id);
    setHistoryList(updated);
  };

  const handleClearAllHistory = () => {
    clearHistory();
    setHistoryList([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-bengali">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {activeTab === 'generate' && (
          <div className="space-y-8">
            {/* Prompt Form Section */}
            {!isGenerating && !videoUrl && (
              <PromptForm
                onSubmit={handleStartGeneration}
                isGenerating={isGenerating}
                isConnected={isConnected}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            )}

            {/* Active Generation Progress Screen */}
            {isGenerating && (
              <JobProgressCard
                jobStatus={jobStatus}
                logs={logs}
                promptText={currentPrompt}
                modelUsed={currentModel}
                onReset={handleResetGeneration}
                onStop={handleStopJob}
              />
            )}

            {/* Ready Video Output Screen */}
            {!isGenerating && videoUrl && (
              <VideoPlayerCard
                videoUrl={videoUrl}
                promptText={currentPrompt}
                modelUsed={currentModel}
                onReset={handleResetGeneration}
              />
            )}
          </div>
        )}

        {/* History Gallery Tab */}
        {activeTab === 'history' && (
          <HistoryView
            historyList={historyList}
            onSelectHistory={handleSelectHistory}
            onDeleteHistory={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />
        )}

        {/* Colab Script Tab */}
        {activeTab === 'colab' && <ColabScriptView />}

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        colabUrl={colabUrl}
        onSaveUrl={handleSaveColabUrl}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>AI Promo Studio — ১০০% ফ্রী ও ওপেন সোর্স ফ্লাইট টিকেট প্রমো জেনারেটর</p>
      </footer>

    </div>
  );
}

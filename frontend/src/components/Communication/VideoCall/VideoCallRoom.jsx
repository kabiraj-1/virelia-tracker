import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { useAuth } from '../../../../contexts/AuthContext';
import VideoControls from './VideoControls';
import PeerVideo from './PeerVideo';
import { Users, X } from 'lucide-react';

const VideoCallRoom = ({ roomId, onEndCall }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [callStatus, setCallStatus] = useState('connecting');
  
  const localVideoRef = useRef(null);
  const peerConnections = useRef(new Map());
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    initializeCall();
    return () => cleanupCall();
  }, [roomId]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Join video call room
      socket.emit('join_video_call', { roomId });

      // Set up WebRTC handlers
      setupWebRTCHandlers();

      setCallStatus('connected');
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setCallStatus('failed');
    }
  };

  const setupWebRTCHandlers = () => {
    socket.on('user_joined_call', handleUserJoined);
    socket.on('user_left_call', handleUserLeft);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice_candidate', handleICECandidate);
  };

  const handleUserJoined = async (data) => {
    const { userId, username } = data;
    
    // Create peer connection
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream to connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStreams(prev => new Map(prev.set(userId, {
        stream: remoteStream,
        username: username
      })));
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice_candidate', {
          roomId,
          targetUserId: userId,
          candidate: event.candidate
        });
      }
    };

    peerConnections.current.set(userId, peerConnection);

    // Create and send offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      socket.emit('offer', {
        roomId,
        targetUserId: userId,
        offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }

    // Update participants
    setParticipants(prev => [...prev, { id: userId, username: username }]);
  };

  const handleUserLeft = (data) => {
    const { userId } = data;
    
    // Close peer connection
    const peerConnection = peerConnections.current.get(userId);
    if (peerConnection) {
      peerConnection.close();
      peerConnections.current.delete(userId);
    }

    // Remove remote stream
    setRemoteStreams(prev => {
      const newStreams = new Map(prev);
      newStreams.delete(userId);
      return newStreams;
    });

    // Update participants
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };

  const handleOffer = async (data) => {
    const { userId, username, offer } = data;
    
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStreams(prev => new Map(prev.set(userId, {
        stream: remoteStream,
        username: username
      })));
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice_candidate', {
          roomId,
          targetUserId: userId,
          candidate: event.candidate
        });
      }
    };

    try {
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit('answer', {
        roomId,
        targetUserId: userId,
        answer
      });

      peerConnections.current.set(userId, peerConnection);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (data) => {
    const { userId, answer } = data;
    const peerConnection = peerConnections.current.get(userId);
    
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(answer);
      } catch (error) {
        console.error('Error setting remote description:', error);
      }
    }
  };

  const handleICECandidate = async (data) => {
    const { userId, candidate } = data;
    const peerConnection = peerConnections.current.get(userId);
    
    if (peerConnection && candidate) {
      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        
        peerConnections.current.forEach(peerConnection => {
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Update local stream
        const newStream = new MediaStream([
          videoTrack,
          ...localStream.getAudioTracks()
        ]);
        
        setLocalStream(newStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
        }

        setIsScreenSharing(true);

        // Handle when screen sharing stops
        videoTrack.onended = () => {
          toggleScreenShare();
        };
      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        const videoTrack = cameraStream.getVideoTracks()[0];
        
        peerConnections.current.forEach(peerConnection => {
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        setLocalStream(cameraStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream;
        }

        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen sharing failed:', error);
    }
  };

  const endCall = () => {
    socket.emit('leave_video_call', { roomId });
    cleanupCall();
    onEndCall();
  };

  const cleanupCall = () => {
    // Close all peer connections
    peerConnections.current.forEach(peerConnection => {
      peerConnection.close();
    });
    peerConnections.current.clear();

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Remove socket listeners
    if (socket) {
      socket.off('user_joined_call', handleUserJoined);
      socket.off('user_left_call', handleUserLeft);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice_candidate', handleICECandidate);
    }
  };

  const getGridClass = () => {
    const totalParticipants = remoteStreams.size + 1;
    
    if (totalParticipants === 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            callStatus === 'connected' ? 'bg-green-500' : 
            callStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="font-medium">
            {callStatus === 'connected' ? 'Connected' : 
             callStatus === 'connecting' ? 'Connecting...' : 'Call Failed'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>{participants.length + 1} participants</span>
        </div>
        
        <button
          onClick={endCall}
          className="p-2 hover:bg-red-600 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Video Grid */}
      <div className={`flex-1 grid ${getGridClass()} gap-4 p-4`}>
        {/* Local Video */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
            {user?.username} (You) {!isVideoEnabled && '• Video Off'}
          </div>
        </div>

        {/* Remote Videos */}
        {Array.from(remoteStreams.entries()).map(([userId, { stream, username }]) => (
          <PeerVideo
            key={userId}
            stream={stream}
            username={username}
            isVideoEnabled={true}
            isAudioEnabled={true}
          />
        ))}
      </div>

      {/* Controls */}
      <VideoControls
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        isScreenSharing={isScreenSharing}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onToggleScreenShare={toggleScreenShare}
        onEndCall={endCall}
      />
    </div>
  );
};

export default VideoCallRoom;
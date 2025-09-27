import React, { useState, useEffect, useRef } from 'react';
import type { Student, AttendanceRecord, MarkAttendanceResult } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface AttendanceManagerProps {
  students: Student[];
  attendance: AttendanceRecord[];
  markStudentAttendance: (scannedId: string) => MarkAttendanceResult;
}

const AttendanceManager: React.FC<AttendanceManagerProps> = ({ students, attendance, markStudentAttendance }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [highlightedStudentId, setHighlightedStudentId] = useState<number | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    
    const qrCodeScanner = new Html5Qrcode('qr-reader');
    scannerRef.current = qrCodeScanner;
    
    qrCodeScanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText, decodedResult) => {
        const result = markStudentAttendance(decodedText);
        // FIX: Inverted the conditional to check for the failure case first, ensuring
        // TypeScript correctly narrows the type and allows access to `result.message`.
        if (!result.success) {
            setScanResult(result.message);
        } else {
            setScanResult(`Welcome, ${result.student.name}! Marked present.`);
            setHighlightedStudentId(result.student.id);
            setTimeout(() => setHighlightedStudentId(null), 2000); // Highlight for 2 seconds
        }
        stopScanning();
      },
      (errorMessage) => {
        // handle scan error, usually safe to ignore
      }
    ).catch((err) => {
      setScanResult(`Error starting scanner: ${err.message}`);
      setIsScanning(false);
    });
  };
  
  const stopScanning = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        setIsScanning(false);
      }).catch(err => {
        console.error("Failed to stop scanner", err);
        setIsScanning(false);
      });
    } else {
        setIsScanning(false);
    }
  };

  useEffect(() => {
    // Cleanup scanner on component unmount
    return () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(err => console.error("Cleanup failed", err));
        }
    };
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysAttendanceRecords = attendance.filter(record => record.timestamp.startsWith(today));
  const attendedStudentIds = new Set(todaysAttendanceRecords.map(r => r.studentId));

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-onSurface mb-6">Attendance Manager</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <h3 className="text-xl font-bold mb-4">QR Code Scanner</h3>
            {!isScanning ? (
                <div className="text-center">
                    <p className="text-onSurfaceSecondary mb-6">Start the scanner to mark attendance using student QR codes.</p>
                    <Button onClick={startScanning}>Start QR Scanning</Button>
                </div>
            ) : (
                 <div className="text-center">
                    <p className="text-onSurfaceSecondary mb-4">Point the camera at a student's QR code.</p>
                    <div id="qr-reader" className="w-full max-w-sm mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"></div>
                    <Button onClick={stopScanning} className="!bg-red-600 hover:!bg-red-700 mt-4">Stop Scanning</Button>
                </div>
            )}
             {scanResult && (
                <p className={`mt-4 text-center font-semibold ${scanResult.startsWith('Welcome') ? 'text-green-600' : 'text-red-600'}`}>
                    {scanResult}
                </p>
            )}
        </Card>

        <Card>
            <h3 className="text-xl font-bold mb-4">Today's Attendance ({attendedStudentIds.size} / {students.length})</h3>
            <div className="max-h-96 overflow-y-auto">
                {students.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {students.map(student => {
                            const isPresent = attendedStudentIds.has(student.id);
                            const isHighlighted = highlightedStudentId === student.id;
                            return (
                                <li key={student.id} className={`py-3 flex justify-between items-center transition-all duration-500 ${isHighlighted ? 'bg-green-100 scale-105' : ''}`}>
                                    <span>{student.name} <span className="text-sm text-onSurfaceSecondary">(Roll: {student.rollNo})</span></span>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isPresent ? 'PRESENT' : 'ABSENT'}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-onSurfaceSecondary">No students in the roster.</p>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceManager;
import React, { useState, useEffect } from 'react';
import { registrationService } from '../../services/registrationService';
import { AttendanceTable } from '../../components/tables/AttendanceTable';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { StatCard } from '../../components/dashboard/StatCard';
import { CheckSquare, Calendar, Award } from 'lucide-react';

export function StudentAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      setLoading(true);
      try {
        const data = await registrationService.getMyRegistrations();
        setRecords(data || []);
      } catch (err) {
        console.error('Failed to load attendance records', err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const attendedCount = records.filter((r) => r.attended).length;
  const attendanceRate = records.length > 0 ? Math.round((attendedCount / records.length) * 100) : 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
          Personal Attendance Verification
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          Official attendance logs recorded and verified by society executives at campus events.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Events Attended"
          value={attendedCount}
          subtitle="Verified check-ins"
          icon={CheckSquare}
          color="forest"
        />
        <StatCard
          title="Events Registered"
          value={records.length}
          subtitle="Total RSVPs submitted"
          icon={Calendar}
          color="navy"
        />
        <StatCard
          title="Personal Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle="Attendance reliability"
          icon={Award}
          color="gold"
        />
      </div>

      {/* Attendance Roster Table */}
      <AttendanceTable records={records} loading={loading} />
    </div>
  );
}

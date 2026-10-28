import React from 'react';
import { Card } from '../../components/common/Card';
import { Shield, Award, Users, BookOpen, CheckCircle, Mail, MapPin } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-forest-700 block mb-2">
          University Governance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-navy-900 leading-tight">
          About the College Club Management System
        </h1>
        <p className="mt-4 text-sm sm:text-base text-ink-secondary leading-relaxed">
          The centralized platform connecting students, faculty mentors, executive leaders, and campus administrators under a single unified collegiate ecosystem.
        </p>
      </div>

      {/* Mission & Purpose */}
      <Card className="p-8 sm:p-10 border-gold/30">
        <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4 pb-3 border-b border-border">
          Our Collegiate Mission
        </h2>
        <p className="text-sm text-ink-primary leading-relaxed mb-4">
          The University Student Affairs Board established this portal to foster student-led initiative, academic rigor outside the classroom, artistic self-expression, and sportsmanship. By streamlining organization recognition, membership management, event logistics, and attendance tracking, we ensure every student has direct access to life-changing collegiate organizations.
        </p>
        <p className="text-sm text-ink-primary leading-relaxed">
          Each society recognized on this platform complies with the university's non-discrimination statutes, transparent financial accounting practices, and academic integrity guidelines.
        </p>
      </Card>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="w-10 h-10 rounded-lg bg-navy-900 text-gold flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">Verified Governance</h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            All registered organizations undergo annual review and administrative approval by the university director of student affairs.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-lg bg-forest-700 text-white flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">Inclusive Access</h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Open membership applications, transparent admission criteria, and university-wide event accessibility for all enrolled undergraduates and graduates.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-10 h-10 rounded-lg bg-gold text-navy-900 flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-navy-900 mb-2">Leadership Credentials</h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Verified event attendance and leadership tenures can be exported as co-curricular transcripts for career opportunities and graduate school applications.
          </p>
        </Card>
      </div>

      {/* Contact & Support */}
      <Card className="p-8 bg-ivory-50/70">
        <h3 className="font-serif text-xl font-bold text-navy-900 mb-4">
          Student Affairs Directorate Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-ink-secondary">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-navy-900 block mb-0.5">Physical Office</strong>
              <p>Founders Hall, Suite 300, Central University Quad</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
            <div>
              <strong className="text-navy-900 block mb-0.5">Email Inquiries</strong>
              <p>student-affairs@collegeclub.edu / support@collegeclub.edu</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

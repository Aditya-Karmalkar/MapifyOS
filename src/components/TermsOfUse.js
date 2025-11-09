import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, Code } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/login" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
          </div>
          <p className="text-gray-600">Last updated: November 9, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-blue-600" />
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Mapify OS. These Terms of Use ("Terms") govern your use of our mapping platform, 
                SDK, and related services (collectively, the "Service"). By accessing or using our Service, 
                you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Mapify OS provides an open-source mapping platform with developer APIs, allowing users to 
                embed interactive maps and access location-based services.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By creating an account, accessing our website, or using our SDK, you acknowledge that you have 
                read, understood, and agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                3. User Accounts
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Account Creation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You must create an account to access certain features of our Service. You are responsible 
                    for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Account Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You are responsible for all activities that occur under your account. Please notify us 
                    immediately of any unauthorized use of your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.3 Accurate Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You agree to provide accurate, current, and complete information when creating your account 
                    and to update such information as necessary.
                  </p>
                </div>
              </div>
            </section>

            {/* API Usage */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Code className="h-6 w-6 mr-2 text-blue-600" />
                4. API Usage and SDK
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 API Keys</h3>
                  <p className="text-gray-700 leading-relaxed">
                    API keys are provided for legitimate use of our services. You must not share, distribute, 
                    or expose your API keys publicly. You are responsible for all usage under your API keys.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Usage Limits</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may impose usage limits on API calls. Excessive usage may result in temporary or 
                    permanent suspension of your API access.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.3 Prohibited Uses</h3>
                  <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
                    <li>Using the API for illegal activities</li>
                    <li>Attempting to reverse engineer or hack our services</li>
                    <li>Overloading our servers with excessive requests</li>
                    <li>Violating any applicable laws or regulations</li>
                    <li>Infringing on third-party rights</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.1 Our Rights</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Mapify OS and its original content, features, and functionality are owned by us and are 
                    protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.2 Open Source Components</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our platform uses various open-source components. The use of these components is governed 
                    by their respective licenses, including but not limited to OpenStreetMap data and Leaflet library.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your 
                use of the Service, to understand our practices.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our Service, you consent to the collection and use of information in accordance 
                with our Privacy Policy.
              </p>
            </section>

            {/* Service Availability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to maintain high availability of our services, but we do not guarantee uninterrupted 
                access. We may temporarily suspend the Service for maintenance or updates.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time 
                with or without notice.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the fullest extent permitted by law, Mapify OS shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability to you for all damages shall not exceed the amount you have paid us 
                in the twelve (12) months preceding the claim.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without 
                prior notice, for conduct that we believe violates these Terms or is harmful to other 
                users, us, or third parties.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may terminate your account at any time by contacting us or through your account settings.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any 
                material changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the Service after any such changes constitutes your acceptance of 
                the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@mapifyos.com</p>
                <p className="text-gray-700"><strong>Website:</strong> https://mapifyos.com</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;

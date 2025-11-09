import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, Lock, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">Last updated: November 9, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2 text-blue-600" />
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Mapify OS, we are committed to protecting your privacy and ensuring the security of your 
                personal information. This Privacy Policy explains how we collect, use, disclose, and 
                safeguard your information when you use our mapping platform and services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our Service, you consent to the data practices described in this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 mr-2 text-blue-600" />
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 Personal Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    We collect information you provide directly to us, such as:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
                    <li>Email address (for account creation and authentication)</li>
                    <li>Name (if provided)</li>
                    <li>Profile information (if provided)</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Usage Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    We automatically collect certain information about your use of our services:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
                    <li>API usage statistics and patterns</li>
                    <li>IP addresses and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on our platform</li>
                    <li>Error logs and performance data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.3 Location Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you use our mapping services, we may collect location data to provide accurate 
                    mapping and location-based features. This information is processed to deliver our services 
                    and is not stored permanently unless necessary for service functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing API requests and managing your account</li>
                <li>Communicating with you about your account and our services</li>
                <li>Monitoring usage patterns to optimize performance</li>
                <li>Detecting and preventing fraud, abuse, and security issues</li>
                <li>Complying with legal obligations and enforcing our Terms of Use</li>
                <li>Developing new features and services</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 We Do Not Sell Your Data</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    for commercial purposes.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Service Providers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may share your information with trusted third-party service providers who assist us 
                    in operating our platform, such as cloud hosting services, analytics providers, and 
                    customer support tools.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.3 Legal Requirements</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may disclose your information if required by law, court order, or government request, 
                    or to protect our rights, property, or safety, or that of others.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2 text-blue-600" />
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Security Measures Include:</h4>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure API key management</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to provide our services 
                and fulfill the purposes outlined in this Privacy Policy.
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Account Information:</strong> Retained while your account is active and for a 
                  reasonable period after account deletion.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Usage Data:</strong> Typically retained for 12-24 months for analytics and 
                  service improvement purposes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>API Logs:</strong> Retained for 90 days for debugging and security purposes.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Access:</strong> You can request access to your personal information we hold.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Correction:</strong> You can request correction of inaccurate information.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Deletion:</strong> You can request deletion of your personal information.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Portability:</strong> You can request a copy of your data in a portable format.
                  </p>
                </div>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-6 w-6 mr-2 text-blue-600" />
                8. Third-Party Services
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our platform integrates with various third-party services to provide mapping functionality:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">OpenStreetMap</h4>
                  <p className="text-gray-700 text-sm">
                    We use OpenStreetMap data for our mapping services. Please review their 
                    <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Firebase (Google)</h4>
                  <p className="text-gray-700 text-sm">
                    We use Firebase for authentication and data storage. Please review Google's 
                    <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under the age of 13. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            {/* International Users */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Users</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are hosted and operated from various locations. If you are accessing our 
                services from outside these locations, please be aware that your information may be 
                transferred to, stored, and processed in countries where our servers are located.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We encourage you to review this Privacy Policy periodically to stay informed about how 
                we protect your information.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@mapifyos.com</p>
                <p className="text-gray-700"><strong>Website:</strong> https://mapifyos.com</p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond within 48 hours</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

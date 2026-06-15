import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Information We Collect</h2>
              <p>
                At Aura, we collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, shipping address, billing address, phone number, and payment information. We also automatically collect certain information about your device and how you interact with our Services, such as IP address, browser type, pages viewed, and links clicked.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Process your orders and send order confirmations.</li>
                <li>Provide customer support and respond to your inquiries.</li>
                <li>Personalize your shopping experience.</li>
                <li>Send you technical notices, updates, security alerts, and administrative messages.</li>
                <li>Communicate with you about products, services, offers, and events offered by Aura (if you opt-in).</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We share your personal information with third parties only in the ways that are described in this privacy statement:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., payment processors, shipping partners).</li>
                <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Aura or others.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Data Security</h2>
              <p>
                We implement industry-standard security measures, including encryption and secure socket layer (SSL) technology, to protect your personal information. However, no security system is impenetrable, and we cannot guarantee the security of our databases, nor can we guarantee that the information you supply will not be intercepted while being transmitted to us over the Internet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">5. Your Choices</h2>
              <p>
                You may update, correct, or delete your account information at any time by logging into your online account. You may also opt out of receiving promotional communications from us by following the instructions in those communications. If you opt out, we may still send you non-promotional communications, such as those about your account or our ongoing business relations.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

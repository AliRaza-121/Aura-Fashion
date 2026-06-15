import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Aura website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Aura's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on Aura's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Product Descriptions and Pricing</h2>
              <p>
                We strive to ensure that all details, descriptions, and prices of products appearing on the website are accurate. However, errors may occur. If we discover an error in the price of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">5. Limitation of Liability</h2>
              <p>
                In no event shall Aura or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Aura's website, even if Aura or a Aura authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

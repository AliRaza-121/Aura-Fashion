import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function RefundPolicy() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-32 pb-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900 mb-4">Refund Policy</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">1. Return Window</h2>
              <p>
                We want you to be completely satisfied with your purchase. If you are not entirely happy with your order, we accept returns within 14 days of the original purchase date. Items must be in their original, unworn, and unwashed condition with all tags still attached.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">2. Non-Returnable Items</h2>
              <p>
                Certain types of items cannot be returned, including:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Underwear, swimwear, and intimate apparel (for hygiene reasons)</li>
                <li>Final sale or clearance items</li>
                <li>Gift cards</li>
                <li>Personalized or custom-made products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">3. Return Process</h2>
              <p>
                To initiate a return, please contact our support team at support@aura.com with your order number. We will provide you with a return shipping label and instructions. Please note that return shipping costs may be deducted from your final refund amount, unless the return is due to a defective or incorrect item.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">4. Refunds</h2>
              <p>
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days. For Cash on Delivery orders, refunds may be processed via bank transfer or store credit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wider">5. Exchanges</h2>
              <p>
                We only replace items if they are defective or damaged upon arrival, or if you need a different size of the exact same item. If you need an exchange, email us at support@aura.com to initiate the process. Exchanges are subject to inventory availability.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

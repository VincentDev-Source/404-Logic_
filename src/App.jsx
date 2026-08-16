import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TrainTracker } from './components/TrainTracker';
import { OjolBooking } from './components/OjolBooking';
import { StripePaymentModal } from './components/StripePaymentModal';
import { BusSchedule } from './components/BusSchedule';
import { TerminalInfo } from './components/TerminalInfo';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState('trains'); // trains | ojol | bus | terminals

  // Stripe Modal state
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [pendingBookingDetails, setPendingBookingDetails] = useState(null);

  // Active Booking state after Stripe payment completes
  const [activeBookingState, setActiveBookingState] = useState(null);

  // Trigger Stripe Payment modal from Ojol booking tab
  const handleRequestPayment = (bookingDetails) => {
    setPendingBookingDetails(bookingDetails);
    setIsStripeModalOpen(true);
  };

  // Called when Stripe payment succeeds
  const handlePaymentSuccess = (paymentResult) => {
    setIsStripeModalOpen(false);
    setActiveBookingState({
      status: 'PAID',
      paymentResult,
      bookingDetails: pendingBookingDetails
    });
    setActiveTab('ojol');
  };

  // Cross-component action: Select train station pickup from TrainTracker
  const handleSelectTrainForBooking = (train) => {
    setActiveTab('ojol');
  };

  // Cross-component action: Select shuttle bus ticket
  const handleBookShuttle = (bus) => {
    setActiveTab('ojol');
  };

  const handleResetBooking = () => {
    setActiveBookingState(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {activeTab === 'trains' && (
          <TrainTracker onSelectTrainForBooking={handleSelectTrainForBooking} />
        )}

        {activeTab === 'ojol' && (
          <OjolBooking
            onRequestPayment={handleRequestPayment}
            activeBookingState={activeBookingState}
            onResetBooking={handleResetBooking}
          />
        )}

        {activeTab === 'bus' && (
          <BusSchedule onBookShuttle={handleBookShuttle} />
        )}

        {activeTab === 'terminals' && (
          <TerminalInfo />
        )}

      </main>

      {/* Stripe Payment Gateway Checkout Modal */}
      <StripePaymentModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        bookingDetails={pendingBookingDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;

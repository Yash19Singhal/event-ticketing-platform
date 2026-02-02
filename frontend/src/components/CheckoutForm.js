import { useState } from 'react';
import axios from 'axios';

const CheckoutForm = ({ eventId, tickets }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      
      const { data: order } = await axios.post(
        '/api/orders/create-order',
        { eventId, tickets },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Event Ticketing Platform',
        description: 'Ticket Purchase',
        order_id: order.id,

        handler: function (response) {
          
          console.log('Payment success:', response);
          setSucceeded(true);
          setProcessing(false);
        },

        modal: {
          ondismiss: function () {
            
            setError('Payment was cancelled by the user.');
            setProcessing(false);
          },
        },

        theme: {
          color: '#3399cc',
        },
      };

      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      
      console.error(err);
      setError('Unable to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <button
        onClick={handlePayment}
        disabled={processing || succeeded}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          cursor: processing ? 'not-allowed' : 'pointer',
        }}
      >
        {processing
          ? 'Processing...'
          : succeeded
          ? 'Payment Successful'
          : 'Pay with Razorpay'}
      </button>

      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      
      {succeeded && (
        <div
          style={{
            color: 'green',
            marginTop: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          <p>Thank you for your purchase!</p>
          <p>Your tickets are being generated.</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;

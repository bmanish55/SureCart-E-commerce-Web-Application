import React from 'react';
import './Policy.css';

const Returns = () => {
  return (
    <div className="policy-page container">
      <h1>Returns Policy</h1>
      <p>
        This Returns Policy is sample content for the SureCart demo. It explains how returns
        and refunds are handled for demonstration purposes.
      </p>

      <h2>30-Day Returns</h2>
      <p>
        Items may be returned within 30 days of delivery for a full refund provided they are in
        original condition with tags attached. Some items such as perishable goods or custom
        products are not eligible for return.
      </p>

      <h2>How to Return</h2>
      <p>
        To initiate a return, contact our support team at returns@estore.example with your order
        number and reason for return. Please include photos if the item arrived damaged.
      </p>

      <h2>Refunds</h2>
      <p>
        Refunds will be processed within 7–10 business days after we receive and inspect the
        returned item. Shipping fees are non-refundable in this demo policy.
      </p>
    </div>
  );
};

export default Returns;

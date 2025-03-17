import React from 'react';

export const metadata = {
  title: 'Contact Us | Front of House Productions',
  description: 'Get in touch with Front of House Productions for your event production needs. Reach us by phone, email, or through our contact form.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

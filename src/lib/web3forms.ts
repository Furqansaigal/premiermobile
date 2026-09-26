/// <reference types="vite/client" />

export interface Web3FormsPayload {
  name: string;
  phone: string;
  vehicleType?: string;
  vehicleMakeModel?: string;
  packageId?: string;
  packageName?: string;
  preferredDate?: string;
  preferredTime?: string;
  locationMetro?: string;
  address?: string;
  notes?: string;
  estimatedPrice?: number;
}

export async function sendWeb3FormsNotification(data: Web3FormsPayload): Promise<boolean> {
  const primaryKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '75b8998e-03c6-4ee2-864d-e741925645f0';
  const clientKey = import.meta.env.VITE_WEB3FORMS_CLIENT_ACCESS_KEY || 'cf0349ae-4b0c-4a24-b564-992f604412b4';

  const validKeys: { label: string; key: string }[] = [];

  if (primaryKey && primaryKey !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
    validKeys.push({ label: 'Primary Email (75b8998e...)', key: primaryKey });
  }

  if (clientKey && clientKey !== 'YOUR_CLIENT_WEB3FORMS_ACCESS_KEY') {
    validKeys.push({ label: 'Client Email (cf0349ae...)', key: clientKey });
  }

  if (validKeys.length === 0) {
    console.log('[Web3Forms] Demo mode active - form data received:', data);
    return true;
  }

  const sendSingle = async (item: { label: string; key: string }) => {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: item.key,
          subject: `New Detailing Request from ${data.name} (${data.phone})`,
          from_name: 'Premier Mobile Auto Detail Booking',
          ...data,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(`[Web3Forms] Successfully sent notification via ${item.label}`);
        return true;
      } else {
        console.error(`[Web3Forms] Failed to send via ${item.label}:`, result.message || result);
        return false;
      }
    } catch (error) {
      console.error(`[Web3Forms] Error sending via ${item.label}:`, error);
      return false;
    }
  };

  // Dispatch all POST requests concurrently
  const results = await Promise.allSettled(validKeys.map(item => sendSingle(item)));

  // Check if at least one request succeeded
  const atLeastOneSuccess = results.some(
    res => res.status === 'fulfilled' && res.value === true
  );

  return atLeastOneSuccess;
}

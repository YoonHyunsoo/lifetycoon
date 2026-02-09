import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseBannerProps {
    adClient: string;
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle';
    fullWidthResponsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

/**
 * Google AdSense Banner Component
 * 
 * Usage:
 * <AdSenseBanner 
 *   adClient="ca-pub-XXXXXXXXXXXXXXXX" 
 *   adSlot="1234567890" 
 *   adFormat="auto" 
 * />
 */
const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
    adClient,
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style,
    className
}) => {

    useEffect(() => {
        try {
            const ads = document.getElementsByClassName("adsbygoogle");
            if (ads.length > 0) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense Error:", e);
        }
    }, [adSlot]); // Re-run if slot changes, though usually it doesn't change after mount

    return (
        <div className={`w-full overflow-hidden my-2 flex justify-center items-center bg-gray-100/5 ${className}`}>
            <ins className="adsbygoogle"
                style={{ display: 'block', minWidth: '300px', minHeight: '50px', ...style }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
            />
        </div>
    );
};

export default AdSenseBanner;

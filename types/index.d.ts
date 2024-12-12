// types/index.d.ts

// Analytics Types
interface AnalyticsEvent {
    eventName: string;
    timestamp: string;
    sessionId: string;
    viewport: {
        width: number;
        height: number;
    };
    userAgent: string;
    [key: string]: any;
}

interface AnalyticsConfig {
    maxBatchSize: number;
    processInterval: number;
}

// Core Functionality Types
interface LightboxConfig {
    transitionDuration: number;
    enableKeyboard: boolean;
    enableSwipe: boolean;
}

interface ParallaxElement extends HTMLElement {
    dataset: {
        speed: string;
    };
}

interface PortfolioImage extends HTMLImageElement {
    dataset: {
        category: string;
    };
}

// Component Types
interface ServiceCard {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
}

interface PricingTier {
    name: string;
    price: number;
    features: string[];
    isPopular?: boolean;
}

interface ContactFormData {
    name: string;
    email: string;
    message: string;
    service: string;
    budget?: string;
}

// Utility Types
type ScrollCallback = (percent: number) => void;
type ImageLoadCallback = (success: boolean) => void;

// Event Handler Types
interface EventHandlers {
    onNavClick: (e: MouseEvent) => void;
    onPortfolioClick: (e: MouseEvent) => void;
    onScroll: (e: Event) => void;
    onLightboxClose: (e: MouseEvent | KeyboardEvent) => void;
}

// Configuration Types
interface SiteConfig {
    analytics: AnalyticsConfig;
    lightbox: LightboxConfig;
    apiEndpoints: {
        analytics: string;
        contact: string;
    };
}

// Class Interfaces
interface IAnalytics {
    trackEvent(eventName: string, eventDetails?: Record<string, any>): void;
    processQueue(): Promise<void>;
    getSessionId(): string;
}

interface ICoreFunctionality {
    initializeComponents(): void;
    setupEventListeners(): void;
    handleParallax(): void;
    setupLightbox(): void;
    handleKeyboardNav(e: KeyboardEvent): void;
}

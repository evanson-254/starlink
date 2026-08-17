export type Plan = {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;
  duration: string;
};
type PlanCardProps = {
  plan: Plan;
  currency: string;
  onSelect: (plan: Plan) => void;
};
export function  PlanCard({ plan, currency="ZMW", onSelect }: PlanCardProps) {
  return (
<article className="plan-card" onClick={(e) => {
          e.stopPropagation();
          onSelect?.(plan);
        }}>
          <div className="plan-header-row">
            <h2 className="plan-name">{plan.name}</h2>
            <span className="plan-pill">{plan.tag}</span>
          </div>
          <p className="plan-desc">{plan.description}</p>
          <div className="plan-price-container">
            <div className="plan-price" data-zmw="ZMW 15.00" data-usd="$0.60">{currency} {plan.price.toFixed(2)}<span> / {plan.duration}</span></div>
          </div>
          <button className="btn-primary" onClick={(e) => {
            e.stopPropagation();
            onSelect?.(plan);
          }}>
            Select Plan &amp; Proceed &rarr;
          </button>
        </article>
  )
}
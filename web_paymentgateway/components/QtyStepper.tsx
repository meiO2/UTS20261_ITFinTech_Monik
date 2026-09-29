    "use client";

    type QtyStepperProps = {
    name: string;
    qty: number;
    onAdd: () => void;
    onRemove: () => void;
    };

    export default function QtyStepper({ name, qty, onAdd, onRemove }: QtyStepperProps) {
    return (
        <div className="stepper" role="group" aria-label={`Quantity of ${name}`}>
        <button onClick={onRemove} aria-label={`Remove one ${name}`}>
            −
        </button>
        <span aria-live="polite">{qty}</span>
        <button onClick={onAdd} aria-label={`Add one more ${name}`}>
            +
        </button>
        </div>
    );
    }
import { Button } from '@/components/UI'

type LoanRecalculationButtonProps = {
  onRecalculate: () => void
}

export function LoanRecalculationButton({
  onRecalculate
}: LoanRecalculationButtonProps) {
  return (
    <Button type="button" onClick={onRecalculate}>
      Recalcular
    </Button>
  )
}

import { cn } from '@/lib/utils';
import {
  ApplicationStatus,
  PIPELINE_STAGES,
  STATUS_LABELS,
} from '@/lib/mock/applications';

interface ApplicationPipelineProps {
  currentStatus: ApplicationStatus;
}

export function ApplicationPipeline({ currentStatus }: ApplicationPipelineProps) {
  const isTerminal = currentStatus === 'REJECTED' || currentStatus === 'WITHDRAWN';
  const isAccepted = currentStatus === 'ACCEPTED' || currentStatus === 'OFFER';

  if (isTerminal) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-sm font-medium text-red-700">
          {STATUS_LABELS[currentStatus]}
        </span>
      </div>
    );
  }

  const currentIndex = PIPELINE_STAGES.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-center">
        {PIPELINE_STAGES.map((stage, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={stage} className="flex flex-1 items-center">
              {/* Step */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    isPast && 'bg-indigo-600 text-white',
                    isCurrent && 'bg-indigo-600 text-white ring-4 ring-indigo-100',
                    isFuture && 'bg-gray-100 text-gray-400',
                  )}
                >
                  {isPast ? (
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'hidden text-center text-xs leading-tight md:block',
                    isCurrent ? 'font-semibold text-indigo-700' : 'text-gray-400',
                    isPast && 'text-gray-500',
                  )}
                  style={{ maxWidth: '64px' }}
                >
                  {STATUS_LABELS[stage]}
                </span>
              </div>

              {/* Connector line */}
              {index < PIPELINE_STAGES.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1',
                    isPast || isCurrent ? 'bg-indigo-600' : 'bg-gray-200',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

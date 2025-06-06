export const CompatibilityScore: React.FC<{ score: number; className?: string }> = ({
    score,
    className = ''
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-success';
        if (score >= 40) return 'text-warning';
        return 'text-destructive';
    };

    const getScoreBg = (score: number) => {
        if (score >= 70) return 'bg-success/10 border-success/20';
        if (score >= 40) return 'bg-warning/10 border-warning/20';
        return 'bg-destructive/10 border-destructive/20';
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className={`relative w-12 h-12 rounded-full border-2 ${getScoreBg(score)} flex items-center justify-center`}>
                <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                    {score}%
                </span>
            </div>
            <div className="text-xs text-muted-foreground">
                <div>Match</div>
                <div>Score</div>
            </div>
        </div>
    );
};
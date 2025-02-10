export function BugPreview({ bug }) {
    const labelColors = {
        'critical': 'red',
        'need-CR': 'blue',
        'dev-branch': 'green',
        'UI': 'orange',
        'Safari': 'lightblue',
        'medium-priority': 'yellow',
        'backend': 'purple',
        'urgent': 'darkred',
        'API': 'brown',
        'low-priority': 'gray',
        'frontend': 'pink',
        'performance': 'cyan',
        'bug': 'lightgreen',
        'security': 'darkblue',
        'notifications': 'gold',
        'enhancement': 'lightcoral',
        'internationalization': 'lightgreen'
    }

    return (
        <div className="bug-preview">
            <h1>{bug.title}</h1>
            <h2>Severity: {bug.severity}</h2>
            <div className="bug-description">
                <p>{bug.description}</p>
            </div>
            <div className="bug-labels">
                {bug.labels && bug.labels.length > 0 ? (
                    bug.labels.map((label, idx) => {
                        const labelColor = labelColors[label] || 'gray'
                        return (
                            <span
                                key={idx}
                                className="bug-label"
                                style={{
                                    backgroundColor: labelColor,
                                    color: 'white',
                                    padding: '5px',
                                    margin: '3px',
                                    borderRadius: '5px'
                                }}
                            >
                                {label}
                            </span>
                        )
                    })
                ) : (
                    <span>No labels</span> 
                )}
            </div>
        </div>
    )
}

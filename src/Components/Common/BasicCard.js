import React from 'react';
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import "./BasicCard.scss";

// BasicCard component definition
const BasicCard = ({
    heading, // Title of the card
    duration = ".", // Duration or subtitle to display
    value, // Main value displayed on the card
    isIcon=true, // Flag to display an icon (default is true)
    icon, // The source URL for the icon image
    iconBackground, // Background color for the icon container
    isStat = true, // Flag to display statistics section (default is true)
    statUpOrDown, // Direction of the stat change ("Up" or "Down")
    statPercent, // Percentage value for the stat change
    statText // Text to accompany the stat (e.g., "increase" or "decrease")
}) => {
    return (
        <Card className='basicCard'> {/* Material-UI Card component for the card structure */}
            {/* Card Head: Displays heading, duration, and main value */}
            <div className='basicCardContainer'>
                <div>
                    {/* Heading of the card */}
                    <Typography gutterBottom className='heading'>{heading}</Typography>
                    <Typography className='duration'>{duration}</Typography>
                    {/* Main value displayed on the card */}
                    <p className='value'>{value}</p>
                </div>

                {/* Icon container with background color, shown conditionally */}
                {isIcon && (
                    <div className='iconContainer' style={{ backgroundColor: iconBackground }}>
                        {/* Icon image with descriptive alt text */}
                        <img src={icon} alt={`${heading} icon`} />
                    </div>
                )}
            </div>

            {/* Card Foot: Displays statistical information (conditional rendering) */}
            {isStat && ( // Conditional rendering for statistics section
                <div className='cardFooterContainer'>
                    <div className='cardFooter'>
                        {/* Display percentage change with conditional styling for "Up" or "Down" */}
                        <span className={statUpOrDown === "Up" ? "up" : "down"}>
                            {statPercent}
                        </span>
                        {/* Conditional rendering for accompanying text (e.g., "increase" or "decrease") */}
                        {statText && <span> {" " + statText}</span>}
                    </div>
                </div>
            )}
        </Card>
    );
}

export default BasicCard;

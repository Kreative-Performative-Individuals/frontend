import React from 'react';
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import "./BasicCard.scss";

// BasicCard component definition
const BasicCard = ({
    heading,                // Title of the card
    duration = ".",               // Duration text (e.g., "per day")
    value,                 // Main value to display on the card
    isIcon=true,           // Flag to indicate if icon should be displayed
    icon,                  // Icon image URL
    iconBackground,        // Background color for the icon container
    isStat = true,         // Flag to indicate if statistics should be displayed
    statUpOrDown,          // Indicates if the statistic is up or down
    statPercent,           // Percentage change for the statistic
    statText               // Text accompanying the statistic (e.g., "Up from yesterday")
}) => {
    return (
        <Card className='basicCard'> {/* Material-UI Card component */}
            {/* Card Head */}
            <div className='basicCardContainer'>
                <div>
                    {/* Heading of the card */}
                    <Typography gutterBottom className='heading'>{heading}</Typography>
                    <Typography className='duration'>{duration}</Typography>
                    {/* Main value displayed on the card */}
                    <p className='value'>{value}</p>
                </div>

                {/* Icon container with background color */}
                {isIcon && (
                    <div className='iconContainer' style={{ backgroundColor: iconBackground }}>
                        {/* Icon image with descriptive alt text */}
                        <img src={icon} alt={`${heading} icon`} />
                    </div>
                )}
            </div>

            {/* Card Foot */}
            {isStat && ( // Conditional rendering for statistics section
                <div className='cardFooterContainer'>
                    <div className='cardFooter'>
                        {/* Display percentage change with conditional styling */}
                        <span className={statUpOrDown === "Up" ? "up" : "down"}>
                            {statPercent}
                        </span>
                        {/* Conditional rendering for accompanying text */}
                        {statText && <span> {" " + statText}</span>}
                    </div>
                </div>
            )}
        </Card>
    );
}

export default BasicCard; // Exporting the BasicCard component
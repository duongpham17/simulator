export const data = [
    {
        title: "Long difference",
        description: ` 
            Buy order will be placed when the (price snapshot) + (long difference) is greater than or equal to current price.
        `,
        example: `Example 
        
            - Price snapshot : 0.30
            - Long difference : 0.005

            Buy position execute when current price is greater than or equal to 
            (0.30 + 0.005) = 0.305
        `
    },
    {
        title: "Short difference",
        description: `
            Sell order will be placed when the (price snapshot) - (short difference) is less than or equal to current price.
        `,
        example: `Example 
    
            - Price snapshot : 0.30
            - Short difference : 0.005

            Sell position execute when current price is less than or equal to 
            (0.30 - 0.005) = 0.295
        `
    },
    {
        title: "Stop loss difference",
        description: `
            Stop loss will be executed at the (open price) - (stop loss difference) is less than or equal to current price.
        `,
        example: `Example 

            - Open price : 0.30
            - Take profit difference : 0.005

            Stop loss execute when current price is less than or equal to 
            (0.30 - 0.005) = 0.295
        `
    },
    {
        title: "Take profit difference",
        description: `
            Take proft will be executed at the (open price) + (take profit difference) is greater than or equal to current price.
        `,
        example: `Example 

            - Open price : 0.30
            - Take profit difference : 0.005

            Take profit execute when current price is greater than or equal to 
            (0.30 + 0.005) = 0.305
        `
    },
    {
        title: "Trailing take profit",
        description: `
            Take profit will update as the price moves past a threshold.
        `,
        example: `Example 

            - Open price : 0.30
            - Take profit difference : 0.005
            - Stop loss difference : 0.005

            Order open 
            - Side buy
            - Stop loss at 0.295
            - Take profit at 0.305

            If current price is 0.305
            - Stop loss updates to ( stop loss + stop loss difference ) = 0.30
            - Take profit updates to ( take profit + take proft difference ) = 0.31
        `
    },
    {
        title: "Reset price snapshot",
        description: `
            The price snapshot will update in minutes you set.
        `,
        example: ` If no position is created, the price snapshot, long difference and short difference targets will be updated.
        `
    },
]

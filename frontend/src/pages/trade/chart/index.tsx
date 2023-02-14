import { LineChart, XAxis, YAxis, Line, Tooltip, ResponsiveContainer  } from 'recharts';
import { useAppSelector } from '@redux/hooks/useRedux';

const Chart = () => {

    const {prices} = useAppSelector((state) => state.trades);

    return ( prices?.length 
        ?

            <ResponsiveContainer width="99%" height={250}>
                <LineChart data={prices} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
                    <XAxis dataKey="createdAt" tickFormatter={(el) => el.slice(12, 16)} minTickGap={100} fontSize={12}/>
                    <YAxis dataKey="price" tickFormatter={(el) => el.toFixed(4)} domain={["dataMin", "auto"]} fontSize={12}/>
                    <Line type="monotone" dataKey="price" stroke={"rgb(49, 153, 239)"} dot={false}/>
                    <Tooltip contentStyle={{backgroundColor: "rgba(231, 231, 231, 0.462"}} />
                </LineChart>
            </ResponsiveContainer>        

        : 
            null
    )
}

export default Chart
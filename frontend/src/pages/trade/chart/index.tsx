import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer  } from 'recharts';
import { useAppSelector } from '@redux/hooks/useRedux';

const Chart = () => {

    const {prices} = useAppSelector((state) => state.trades);

    return ( prices?.length 
        ?

            <ResponsiveContainer width="99%" height={250} >
                <AreaChart data={prices} margin={{ top: 18, right: 0, left: -16, bottom: 0 }}>
                    <XAxis dataKey="createdAt" tickFormatter={(el) => el.slice(11, 16)} minTickGap={200} fontSize={12}/>
                    <YAxis dataKey="price" tickFormatter={(el) => el.toFixed(4)} domain={["dataMin", "auto"]} fontSize={12}/>
                    <Area type="monotone" dataKey="price" stroke={"rgb(49, 153, 239)"} dot={false} opacity={0.5}/>
                    <Tooltip contentStyle={{backgroundColor: "rgba(231, 231, 231, 0.462"}} />
                </AreaChart>
            </ResponsiveContainer>        
        : 
            null
    )
}

export default Chart
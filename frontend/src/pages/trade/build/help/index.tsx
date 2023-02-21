import Show from '@components/show/Style1';
import Container from '@components/container/Style1';
import Paragraph from '@components/paragraph/Style1';
import Overflow from '@components/overflow/Overflow';
import Grid from '@components/grid/Style2';

import {data} from './data';

interface Props{
    onClose: () => void;
}

const Information = ({onClose}: Props) => (
    <Show onClose={onClose}>
        <Overflow maxHeight={400}>
            {data.map((el) => 
                <Container key={el.title} background="dark">
                    <Grid columns='0.8fr 1fr'>
                        <div>
                            <Paragraph text={el.title} weight={600}/>
                            <Paragraph text={el.description} />
                        </div>
                        <Container key={el.title} background="dark">
                            <Paragraph text={el.example} light weight={200}/>
                        </Container>
                    </Grid>
                </Container>
            )}
        </Overflow>
    </Show>
)

export default Information
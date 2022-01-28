import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from '@material-ui/core'
import { GetStaticProps } from 'next'
import { FaqModel } from '../../api/Faq'
import { open } from 'sqlite'
import { openDB } from '../openDB'
// import ExpandMoreIcon from '@bit/mui-org.material-ui-icons.expand-more'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface FaqProps {
  faq: FaqModel[]
  ExpansionPanel: JSX.Element
}

export default function Faq({ faq }: FaqProps) {
  return (
    <div>
      {faq.map((f) => (
        <ExpansionPanel key={f.id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>{f.question}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{f.answer}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await openDB()
  const faq = await db.all('SELECT * FROM FAQ ORDER BY createDate DESC')
  return { props: { faq } }
}

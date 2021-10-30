import { styled } from '@mui/system'

export const Badge = styled('img')((props) => ({
  width: props.width + 'rem' || '6rem',
  position: props.position || 'relative',
  padding: '0 15px 0 0',
  top: props.top || 0,
  left: props.left || 0,
  bottom: props.bottom || 0,
  right: props.right || 0,
  marginLeft:
    props.position === 'absolute' ? -(props.width / 2) + 'rem' || -'3rem' : 0,
}))

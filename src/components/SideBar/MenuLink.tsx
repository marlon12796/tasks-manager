import { Link } from "react-router-dom";

export const MenuLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const styles: React.CSSProperties = { borderRadius: '14px' }

  return to.startsWith('/') ? (
    <Link to={to} style={styles}>
      {children}
    </Link>
  ) : (
    <a href={to} target='_blank' style={styles} rel='noreferrer'>
      {children}
    </a>
  )
}

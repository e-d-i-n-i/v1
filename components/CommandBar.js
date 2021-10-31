import * as React from 'react'
import { useRouter } from 'next/router'
import sendEmail from '../lib/send-email'
import {
  KBarAnimator,
  KBarProvider,
  KBarPortal,
  useMatches,
  KBarPositioner,
  KBarSearch,
  KBarResults,
} from 'kbar'

export default function CommandBar(props) {
  const router = useRouter()

  const actions = [
    {
      id: 'copy',
      name: 'Copy URL',
      shortcut: ['u'],
      keywords: 'copy-url',
      section: 'General',
      perform: () => navigator.clipboard.writeText(window.location.href),
      icon: <i className='bi-clipboard' style={iconStyle} />,
    },
    {
      id: 'email',
      name: 'Send Email',
      shortcut: ['e'],
      keywords: 'send-email',
      section: 'General',
      perform: sendEmail,
      icon: <i className='bi-envelope' style={iconStyle} />,
    },
    {
      id: 'github',
      name: 'Github',
      shortcut: ['s', 'g'],
      keywords: 'go-github',
      section: 'Follow',
      perform: () => (window.open('https://github.com/zenorocha', '_blank')),
      icon: <i className='bi-github' style={iconStyle} />,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      shortcut: ['s', 't'],
      keywords: 'go-twitter',
      section: 'Follow',
      perform: () => (window.open('https://twitter.com/zenorocha', '_blank')),
      icon: <i className='bi-twitter' style={iconStyle} />,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      shortcut: ['s', 'i'],
      keywords: 'go-instagram',
      section: 'Follow',
      perform: () => (window.open('https://instagram.com/zenorocha', '_blank')),
      icon: <i className='bi-instagram' style={iconStyle} />,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      shortcut: ['s', 'l'],
      keywords: 'go-linkedin',
      section: 'Follow',
      perform: () => (window.open('https://linkedin.com/in/zenorocha', '_blank')),
      icon: <i className='bi-linkedin' style={iconStyle} />,
    },
    {
      id: 'home',
      name: 'Home',
      shortcut: ['g', 'h'],
      keywords: 'go-home',
      section: 'Go To',
      perform: () => router.push('/'),
      icon: <i className='bi-house' style={iconStyle} />,
    },
    {
      id: 'articles',
      name: 'Articles',
      shortcut: ['g', 'a'],
      keywords: 'go-articles',
      section: 'Go To',
      perform: () => router.push('/articles'),
      icon: <i className='bi-pen' style={iconStyle} />,
    },
    {
      id: 'podcasts',
      name: 'Podcasts',
      shortcut: ['g', 'c'],
      keywords: 'go-podcasts',
      section: 'Go To',
      perform: () => (router.push('/podcasts')),
      icon: <i className='bi-mic' style={iconStyle} />,
    },
    {
      id: 'talks',
      name: 'Talks',
      shortcut: ['g', 't'],
      keywords: 'go-talks',
      section: 'Go To',
      perform: () => (router.push('/talks')),
      icon: <i className='bi-camera-video' style={iconStyle} />,
    },
    {
      id: 'projects',
      name: 'Projects',
      shortcut: ['g', 'p'],
      keywords: 'go-projects',
      section: 'Go To',
      perform: () => (router.push('/projects')),
      icon: <i className='bi-code-slash' style={iconStyle} />,
    },
    {
      id: 'reminder',
      name: 'Reminder',
      shortcut: ['g', 'r'],
      keywords: 'go-reminder',
      section: 'Go To',
      perform: () => (router.push('/reminder')),
      icon: <i className='bi-alarm' style={iconStyle} />,
    },
  ]

  return <KBarProvider actions={actions}>
    <KBarPortal>
      <KBarPositioner style={positionerStyle}>
        <KBarAnimator style={animatorStyle}>
          <KBarSearch style={searchStyle} placeholder='Type a command or search…' />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>

    {props.children}

  </KBarProvider>
}

function RenderResults() {
  const groups = useMatches()
  const flattened = React.useMemo(
    () =>
      groups.reduce((acc, curr) => {
        acc.push(curr.name)
        acc.push(...curr.actions)
        return acc
      }, []),
    [groups]
  )

  return (
    <KBarResults
      items={flattened}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem action={item} active={active} />
        )
      }
    />
  )
}

const ResultItem = React.forwardRef(({ action, active }, ref) => {
  return (
    <div ref={ref} style={getResultStyle(active)}>
      <div style={actionStyle}>
        {action.icon && action.icon}
        <div style={actionRowStyle}>
          <span>{action.name}</span>
          {action.subtitle && (
            <span style={{ fontSize: 12 }}>{action.subtitle}</span>
          )}
        </div>
      </div>
      {action.shortcut?.length ? (
        <div style={shortcutStyle}>
          {action.shortcut.map((shortcut) => (
            <kbd key={shortcut} style={kbdStyle}>
              {shortcut}
            </kbd>
          ))}
        </div>
      ) : null}
    </div>
  )
})

const positionerStyle = {
  position: 'fixed',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  inset: '0px',
  padding: '14vh 16px 16px',
  background: 'rgba(0, 0, 0, .5)',
}

const animatorStyle = {
  maxWidth: '600px',
  width: '100%',
  background: 'var(--commandColor)',
  color: 'var(--primaryColor)',
  borderRadius: '8px',
  overflow: 'hidden',
}

const searchStyle = {
  padding: '12px 16px',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  border: 'none',
  background: 'var(--commandColor)',
  color: 'var(--primaryColor)',
}

const groupNameStyle = {
  padding: '8px 16px',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  opacity: 0.5,
  background: 'var(--commandColor)',
}

const iconStyle = {
  fontSize: '18px'
}

const kbdStyle = {
  padding: '4px 8px',
  textTransform: 'uppercase',
  color: 'var(--secondaryColor)',
  background: 'rgba(255, 255, 255, .1)',
}

const shortcutStyle = {
  display: 'grid',
  gridAutoFlow: 'column',
  gap: '4px'
}

const actionStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}

const actionRowStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const getResultStyle = (active) => {
  return {
    padding: '12px 16px',
    background: active ? 'var(--hoverColor)' : 'var(--commandColor)',
    borderLeft: `2px solid ${
      active ? 'var(--primaryColor)' : 'transparent'
    }`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    color: active ? 'var(--primaryColor)' : 'var(--secondaryColor)',
  }
}
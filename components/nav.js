import preval from 'preval.macro'
import React from 'react'
import glamorous from 'glamorous'
import {algoliaSettings} from '../components/algolia-config'
import {Anchor} from '../components/styled-links'
import LipstickIcon from './lipstick-icon'
import Separator from './separator'
import LocaleChooser from './locale-chooser'
import MenuSVG from './svgs/menu.svg'
import content from './content/nav.md'

const base64SearchSVG = preval`
  const fs = require('fs')
  const path = require('path')
  const svgString = fs.readFileSync(path.join(__dirname, 'svgs/search.svg'), 'utf8')
  const base64String = new Buffer(svgString).toString('base64')
  module.exports = base64String
`

// eslint-disable-next-line complexity
const Navbar = glamorous.nav(({top, theme: {mediaQueries}}) => ({
  width: '100%',
  margin: 0,
  [mediaQueries.largeUp]: {
    display: top ? 'flex' : null,
    justifyContent: top ? 'flex-end' : 'flex-start',
    flexDirection: top ? 'row' : 'column',
    flex: top ? null : 'none',
    width: top ? null : 300,
    alignItems: 'center',
    paddingTop: '0.5rem',
  },
  [mediaQueries.largeDown]: {
    display: null,
    flex: null,
    width: null,
    marginTop: 0,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
}))
const SearchBox = glamorous.input('algolia_searchbox', props => ({
  width: 130,
  borderRadius: 50,
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 30,
  paddingRight: 10,
  fontFamily: 'inherit',
  fontSize: '0.75em',
  lineHeight: '12px',

  // Icons made by Madebyoliver from www.flaticon.com is licensed by CC 3.0 BY
  // http://www.flaticon.com/authors/madebyoliver
  backgroundImage: `url("data:image/svg+xml;base64,${base64SearchSVG}")`,

  backgroundRepeat: 'no-repeat',
  backgroundPosition: '5px center',
  backgroundSize: 'auto 80%',
  border: `1px solid ${props.theme.colors.primaryMed}`,
  transition: 'width 0.2s',
  transitionTimingFunction: 'cubic-bezier(0.075, 0.485, 0.605, 1.085)',
  color: props.theme.colors.darkGray,

  ':focus': {
    width: 220,
    outline: 'none',
    borderColor: `${props.theme.colors.primaryMed}`,
  },

  ':valid': {
    maxWidth: 220,
    minWidth: 100,
  },
}))
SearchBox.defaultProps = {
  type: 'text',
  pattern: '.*',
  required: true,
  placeholder: content.search,
}

const NavToggle = glamorous.a(props => ({
  fill: props.theme.colors.primaryMed,
  backgroundColor: props.theme.colors.white,
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  paddingRight: '0.25rem',

  [props.theme.mediaQueries.largeUp]: {
    display: 'none',
  },
}))

const NavSeparator = glamorous(Separator)(props => ({
  height: 1,

  [props.theme.mediaQueries.largeUp]: {
    display: 'none',
  },
}))

// Used to hide text for a11y - ie. Home in navigation
const Hidden = glamorous.span({
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
})

const ListItem = glamorous.li({
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 4,
  '&::before': {
    display: 'none',
  },
})

const List = glamorous.ul(
  // eslint-disable-next-line complexity
  ({top, isOpen, theme: {colors, mediaQueries}}) => ({
    listStyle: 'none',
    display: 'block',
    fontSize: '1.25em',
    margin: '0 auto',
    paddingLeft: top ? null : 0,
    height: 'auto',
    overflow: 'visible',
    backgroundColor: colors.white,
    padding: 0,
    [mediaQueries.largeUp]: {
      display: 'flex',
      justifyContent: top ? 'center' : 'flex-start',
      flexDirection: top ? 'row' : 'column',
      width: top ? 'auto' : null,
      maxHeight: top ? '4rem' : null,
      backgroundColor: 'inherit',
      opacity: 1,
    },
    [mediaQueries.largeDown]: {
      display: 'block',
      textAlign: 'center',
      width: '100%',
      padding: isOpen ? '1rem 0' : 0,
      maxHeight: isOpen ? '100%' : 0,
      opacity: isOpen ? 1 : 0,
      justifyContent: 'center',
      flexDirection: 'row',
    },
  }),
)

class Nav extends React.Component {
  state = {
    open: false,
  }

  componentDidMount() {
    algoliaSettings()
  }

  handleClick = () => {
    this.setState(prevState => {
      return {open: !prevState.open}
    })
  }

  render() {
    const {pathname, top} = this.props
    return (
      <Navbar className="Navbar" top={top}>
        <NavToggle onClick={this.handleClick}>
          <MenuSVG />
        </NavToggle>
        <NavSeparator />
        <List isOpen={this.state.open} top={top}>
          <ListItemAnchor href="/" css={{textAlign: 'center'}}>
            <LipstickIcon width={top ? 20 : 40} />
            <Hidden>
              {content.home}
            </Hidden>
          </ListItemAnchor>
          <ListItemAnchor href="/getting-started">
            {content.gettingStarted}
          </ListItemAnchor>
          <ListItemAnchor href="/basics">
            {content.basics}
          </ListItemAnchor>
          <ListItemAnchor href="/advanced">
            {content.advanced}
          </ListItemAnchor>
          <ListItemAnchor href="/examples">
            {content.examples}
          </ListItemAnchor>
          <ListItemAnchor href="/integrations">
            {content.integrations}
          </ListItemAnchor>
          <ListItemAnchor href="/api">
            {content.api}
          </ListItemAnchor>
          <ListItem>
            <SearchBox />
          </ListItem>
          <ListItem>
            <LocaleChooser top={top} />
          </ListItem>
        </List>
      </Navbar>
    )

    function ListItemAnchor({children, css, ...rest}) {
      return (
        <ListItem css={css}>
          <Anchor
            prefetch={process.env.USE_PREFETCH}
            href="/getting-started"
            pathname={pathname}
            {...rest}
          >
            {children}
          </Anchor>
        </ListItem>
      )
    }
  }
}

export default Nav

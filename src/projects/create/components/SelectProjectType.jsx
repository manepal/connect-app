import React from 'react'
import PT from 'prop-types'

import ProjectTypeCard from './ProjectTypeCard'
import ProjectTypeIcon from './ProjectTypeIcon'

import ConnectLogoMono from '../../../assets/icons/connect-logo-mono.svg'

import './SelectProjectType.scss'

function SelectProjectType(props) {
  const cards = []

  props.projectTemplates.forEach((item) => {
    // don't render disabled items for selection
    // don't render hidden items as well, hidden items can be reached via direct link though
    if (item.disabled || item.hidden) return

    const icon = <ProjectTypeIcon type={item.icon} />

    cards.push(
      <ProjectTypeCard
        icon={icon}
        info={item.info}
        key={item.id}
        onClick={() => props.onProjectTypeChange(item.key)}
        type={item.name}
        buttonText="Select Project"
      />
    )
  })

  return (
    <div>
      <div className="header headerSelectProjectType">
        <ConnectLogoMono className="icon-connect-logo-mono"/>
      </div>
      <div className="SelectProjectType">
        <h1>Create a new project</h1>
        <div className="cards">{cards}</div>
        <div className="footer">
          Looking for something else? <a href="http://crowdsourcing.topcoder.com/piqued_by_crowdsourcing">Get in touch with us &rarr;</a>
        </div>
      </div>
    </div>
  )
}

SelectProjectType.propTypes = {
  onProjectTypeChange: PT.func.isRequired,
  userRoles: PT.arrayOf(PT.string),
  projectTemplates: PT.array.isRequired,
}

export default SelectProjectType

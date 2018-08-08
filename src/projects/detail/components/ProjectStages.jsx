/**
 * Project stages section
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

import { formatNumberWithCommas } from '../../../helpers/format'
import { getPhaseActualData } from '../../../helpers/projectHelper'

import Section from '../components/Section'
import ProjectStage from '../components/ProjectStage'
import PhaseCardListHeader from '../components/PhaseCardListHeader'
import PhaseCardListFooter from '../components/PhaseCardListFooter'
import { PHASE_STATUS_DRAFT } from '../../../config/constants'

/**
 * Format PhaseCardListFooter props
 *
 * @param {Array}  phases            phases
 * @param {Object} productsTimelines products timelines
 *
 * @returns {Object} PhaseCardListFooter props
 */
function formatPhaseCardListFooterProps(phases, productsTimelines) {
  const filteredPhases = _.filter(phases, (phase) => (phase.status !== PHASE_STATUS_DRAFT))

  const phasesActualData = filteredPhases.map((phase) => {
    const product = _.get(phase, 'products[0]')
    const timeline = _.get(productsTimelines, `[${product.id}].timeline`)
    return getPhaseActualData(phase, timeline)
  })

  const startDates = _.compact(phasesActualData.map((phase) =>
    phase.startDate ? moment(phase.startDate) : null
  ))
  const endDates = _.compact(phasesActualData.map((phase) =>
    phase.endDate ? moment(phase.endDate) : null
  ))
  const minStartDate = startDates.length > 0 ? moment.min(startDates) : null
  const maxEndDate = endDates.length > 0 ? moment.max(endDates) : null

  let startEndDates = minStartDate ? `${minStartDate.format('MMM D')}` : ''
  startEndDates += minStartDate && maxEndDate ? `–${maxEndDate.format('MMM D')}` : ''

  const totalPrice = _.sumBy(filteredPhases, 'budget')

  const projectedDuration = _.sumBy(phasesActualData, (phase) => {return phase.duration && phase.duration > 1 ? phase.duration : 1})
  const duration = `${projectedDuration} days`
  const price = `$${formatNumberWithCommas(totalPrice)}`

  return {
    duration,
    startEndDates,
    price
  }
}

const ProjectStages = ({
  project,
  phases,
  productTemplates,
  productsTimelines,
  currentMemberRole,
  isProcessing,
  isSuperUser,
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
  isManageUser,
  deleteProjectPhase,
}) => (
  <Section>

    <PhaseCardListHeader />
    {
      phases.map((phase, index) => (
        <ProjectStage
          key={phase.id}
          productTemplates={productTemplates}
          currentMemberRole={currentMemberRole}
          isProcessing={isProcessing}
          isSuperUser={isSuperUser}
          isManageUser={isManageUser}
          project={project}
          phase={phase}
          phaseIndex={index}
          updateProduct={updateProduct}
          fireProductDirty={fireProductDirty}
          fireProductDirtyUndo={fireProductDirtyUndo}
          addProductAttachment={addProductAttachment}
          updateProductAttachment={updateProductAttachment}
          removeProductAttachment={removeProductAttachment}
          deleteProjectPhase={deleteProjectPhase}
        />
      ))
    }
    <PhaseCardListFooter {...formatPhaseCardListFooterProps(phases, productsTimelines)}/>

  </Section>
)

ProjectStages.defaultProps = {
  currentMemberRole: null,
}

ProjectStages.propTypes = {
  project: PT.object.isRequired,
  productTemplates: PT.array.isRequired,
  productsTimelines: PT.object,
  currentMemberRole: PT.string,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  updateProduct: PT.func.isRequired,
  fireProductDirty: PT.func.isRequired,
  fireProductDirtyUndo: PT.func.isRequired,
  addProductAttachment: PT.func.isRequired,
  updateProductAttachment: PT.func.isRequired,
  removeProductAttachment: PT.func.isRequired,
  deleteProjectPhase: PT.func.isRequired,
}

export default withRouter(ProjectStages)
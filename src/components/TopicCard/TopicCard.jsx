import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { get, last, sumBy } from 'lodash'
import moment from 'moment'
import cn from 'classnames'

import UserTooltip from '../User/UserTooltip'
import NotificationBellAvatar from './NotificationBellAvatar'
import {
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  CODER_BOT_USERID,
} from '../../config/constants'
import { isSystemUser, getFullNameWithFallback } from '../../helpers/tcHelpers'

import FileIcon from '../../assets/icons/file-12.svg'
import LinkIcon from '../../assets/icons/link-12.svg'
import InvisibleIcon from '../../assets/icons/invisible-12.svg'

import styles from './TopicCard.scss'

const SYSTEM_USER = {
  handle: CODER_BOT_USERID,
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../assets/images/avatar-coder.svg')
}

/**
 * The topic card that shows the topic title, number of links, files, etc
 */
const TopicCard = ({
  title,
  isTopcoderOnly,
  topicId,
  projectId,
  posts,
  notifications,
  author,
  allMembers,
  unread,
  lastActivityAt,
}) => {
  const formatDate = dateStr => moment(dateStr).format('MMMM D')
  const pluralize = (name, num) => `${name}${num > 1 ? 's' : ''}`

  const lastMessageUserId = last(posts).userId
  const lastMessageAuthor = isSystemUser(lastMessageUserId) ? SYSTEM_USER : get(allMembers, lastMessageUserId)
  const lastMessageAuthorName = getFullNameWithFallback(lastMessageAuthor)
  const lastMessageDate = formatDate(lastActivityAt)
  const numNewMessages = get(notifications, 'length')
  const newMessagesFromDate = formatDate(get(notifications, '0.date'))
  const numFiles = sumBy(posts, p => get(p, 'attachments.length', 0))
  const numLinks = sumBy(posts, p => get(p, 'links.length', 0))

  const authorUser = isSystemUser(get(author, 'userId')) ? SYSTEM_USER : author

  return (
    <Link to={`/projects/${projectId}/messages/${topicId}`}>
      <div className={styles.container}>
        {/* If it has new posts, show notification icon. Otherwise, show user avatar */}
        <div className={styles.userImage}>
          {numNewMessages && <NotificationBellAvatar />}
          {!numNewMessages && author && (
            <UserTooltip
              usr={authorUser}
              previewAvatar
              size={40}
              id={'userTooltip-inTopicCard-' + topicId}
            />
          )}
        </div>

        {/* Topic title and subtitle in the middle */}
        <div className={styles.body}>
          <div className={cn(styles.title, { [styles.unreadPosts]: unread })}>
            {isTopcoderOnly ? <InvisibleIcon /> : null} {title}
          </div>

          <div className={styles.subTitle}>
            {numNewMessages ? (
              <span className={styles.newMessagesLabel}>
                {numNewMessages} new message{numNewMessages > 1 ? 's' : ''} from{' '}
                {newMessagesFromDate}
              </span>
            ) : (
              <span className={styles.lastMessageLabel}>
                Last message {lastMessageDate} by{' '}
                <span className={styles.lastAuthorName}>
                  {lastMessageAuthor
                    ? lastMessageAuthorName
                    : lastMessageUserId}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* The meta information on the right */}
        <div className={styles.metaInfo}>
          {numFiles ? (
            <span className={styles.metaInfoItem}>
              <FileIcon /> {numFiles} {pluralize('file', numFiles)}
            </span>
          ) : null}
          {numLinks ? (
            <span className={styles.metaInfoItem}>
              <LinkIcon /> {numLinks} {pluralize('link', numLinks)}
            </span>
          ) : null}
          {isTopcoderOnly && (
            <span className={cn(styles.metaInfoItem, styles.topcoderOnlyLabel)}>
              Topcoder only
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

TopicCard.propTypes = {
  title: PropTypes.string.isRequired,
  isTopcoderOnly: PropTypes.bool,
  topicId: PropTypes.number,
  projectId: PropTypes.number,
  posts: PropTypes.array,
  notifications: PropTypes.array,
  author: PropTypes.object,
  allMembers: PropTypes.object,
  unread: PropTypes.bool,
  lastActivityAt: PropTypes.string,
}

export default TopicCard

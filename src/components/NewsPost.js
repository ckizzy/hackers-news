import PropTypes from 'prop-types';
import { StyledPost } from '../components/styles/NewsPost.styles';
export default function NewsPost({ title, url, score, time, author, num }) {
  // helper: transform time to desired outcome
  const getTime = timestamp => {
    const today = new Date();

    // calculate the time difference of two dates
    const diffInTime = today.getTime() - timestamp * 1000;

    // calculate the no. of days between two dates
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // get round
    const rounded = Math.round(diffInDays);

    // set today if < 1 days
    const outcome = rounded === 0 ? 'today' : `${rounded} days ago`;

    return outcome;
  };

  // helper: transform url to desired outcome
  const trimUrl = urlToTrim => {
    let trimedUrl = '';
    if (urlToTrim) {
      if (urlToTrim.split('/').length > 0) {
        trimedUrl = urlToTrim.split('/')[2];
      }
    }

    return trimedUrl;
  };

  return (
    <StyledPost>
      <h2>
        {num}. {title}
      </h2>
      <span>
        <a href={url} target="_blank" rel="noreferrer">
          {trimUrl(url)}
        </a>
      </span>
      <div>
        <strong>{score} points</strong> by
        <strong> {author} </strong>
        {getTime(time)}
      </div>
    </StyledPost>
  );
}

NewsPost.propTypes = {
  title: PropTypes.string.isRequired,
  num: PropTypes.number.isRequired,
  url: PropTypes.string,
  author: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  time: PropTypes.number
};

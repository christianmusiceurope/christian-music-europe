import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collectArtistVideos } from './artist-videos';
import { youtubeVideoId } from './youtube';

const curated = {
  _key: 'curated-1',
  url: 'https://www.youtube.com/watch?v=e7hfg_JzOmY',
  title: 'Curated video',
};

const curatedShort = {
  _key: 'curated-short',
  url: 'https://youtu.be/e7hfg_JzOmY',
  title: 'Same video, short URL',
};

const articleOnly = {
  _key: 'article-1',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'From an article',
};

const bioWouldHaveBeen = {
  _key: 'bio-1',
  url: 'https://www.youtube.com/watch?v=aaaaaaaaaaa',
  title: 'From the biography',
};

test('curated videos come first, then article embeds', () => {
  const videos = collectArtistVideos({
    curated: [curated],
    articleGroups: [{embeds: [articleOnly]}],
  });
  assert.deepEqual(
    videos.map((video) => video.title),
    ['Curated video', 'From an article'],
  );
});

test('dedupes curated and article videos by YouTube video id, keeping the curated entry', () => {
  const videos = collectArtistVideos({
    curated: [curated],
    articleGroups: [{embeds: [curatedShort, articleOnly]}],
  });
  assert.equal(videos.length, 2);
  assert.equal(videos[0].url, curated.url);
  assert.equal(videos[0].title, 'Curated video');
  assert.equal(videos[1].title, 'From an article');
  assert.equal(youtubeVideoId(videos[0].url), youtubeVideoId(curatedShort.url));
});

test('does not take a bio embed argument, so biography videos stay out of the grid', () => {
  const videos = collectArtistVideos({
    curated: [curated],
    articleGroups: [{embeds: [articleOnly]}],
  });
  assert.equal(
    videos.some((video) => video.url === bioWouldHaveBeen.url),
    false,
  );
});

test('skips channel links and other non-video URLs', () => {
  const videos = collectArtistVideos({
    curated: [
      {_key: 'channel', url: 'https://www.youtube.com/@kristianmecha', title: 'Channel'},
      curated,
    ],
  });
  assert.deepEqual(
    videos.map((video) => video.url),
    [curated.url],
  );
});

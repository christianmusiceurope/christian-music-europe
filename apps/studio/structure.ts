import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Christian Music Europe')
    .items([
      S.listItem()
        .title('Music Catalog')
        .child(
          S.list()
            .title('Music Catalog')
            .items([
              S.documentTypeListItem('artist').title('Artists'),
              S.documentTypeListItem('release').title('Releases'),
              S.documentTypeListItem('song').title('Songs'),
              S.documentTypeListItem('genre').title('Genres'),
            ]),
        ),
      S.listItem()
        .title('Geography')
        .child(
          S.list()
            .title('Geography')
            .items([
              S.documentTypeListItem('country').title('Countries'),
              S.documentTypeListItem('venue').title('Venues'),
            ]),
        ),
      S.listItem()
        .title('Live Music')
        .child(
          S.list()
            .title('Live Music')
            .items([
              S.documentTypeListItem('event').title('Events'),
              S.documentTypeListItem('festival').title('Festivals'),
            ]),
        ),
      S.listItem()
        .title('Editorial')
        .child(
          S.list()
            .title('Editorial')
            .items([
              S.listItem()
                .title('Artist Spotlights')
                .schemaType('artistSpotlight')
                .child(
                  S.documentTypeList('artistSpotlight')
                    .title('Artist Spotlights')
                    .defaultOrdering([{field: 'startDate', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Social Posts')
                .schemaType('socialPost')
                .child(
                  S.documentTypeList('socialPost')
                    .title('Social Posts')
                    .defaultOrdering([{field: 'postedAt', direction: 'desc'}]),
                ),
              S.documentTypeListItem('article').title('Articles'),
              S.documentTypeListItem('playlist').title('Playlists'),
              S.documentTypeListItem('chart').title('Charts'),
            ]),
        ),
      S.listItem()
        .title('Publishing')
        .child(
          S.list()
            .title('Publishing')
            .items([S.documentTypeListItem('campaign').title('Campaigns')]),
        ),
    ])

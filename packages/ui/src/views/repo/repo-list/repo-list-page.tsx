import { FC, useMemo } from 'react'

import { ListActions, NoData, Pagination, SearchBox, Spacer, SplitButton } from '@/components'
import { useRouterContext } from '@/context'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'

import { RepoList } from './repo-list'
import { RepoListProps } from './types'

const SandboxRepoListPage: FC<RepoListProps> = ({
  useRepoStore,
  useTranslationStore,
  isLoading,
  isError,
  errorMessage,
  searchQuery,
  setSearchQuery,
  toCreateRepo,
  toImportRepo,
  ...routingProps
}) => {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()

  const {
    search: searchInput,
    handleSearchChange: handleInputChange,
    handleResetSearch
  } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  // State for storing saved filters and sorts
  // null means no saved state exists
  const { repositories, totalPages, page, setPage } = useRepoStore()

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load', {
          type: 'repositories'
        })}
        description={[
          errorMessage ||
            t(
              'views:noData.errorApiDescription',
              'An error occurred while loading the data. Please try again and reload the page.'
            )
        ]}
        primaryButton={{
          label: t('views:notFound.button', 'Reload page'),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  const noData = !(repositories && !!repositories.length)
  const showTopBar = !noData || !!searchQuery?.length || page !== 1

  const handleResetFiltersQueryAndPages = () => {
    handleResetSearch()
    setPage(1)
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        {showTopBar && (
          <>
            <Spacer size={8} />
            <div className="flex items-end">
              <h1 className="text-2xl font-medium text-cn-foreground-1">
                {t('views:repos.repositories', 'Repositories')}
              </h1>
            </div>
            <Spacer size={6} />
            <ListActions.Root>
              <ListActions.Left>
                <SearchBox.Root
                  width="full"
                  className="max-w-96"
                  value={searchInput || ''}
                  handleChange={handleInputChange}
                  placeholder={t('views:repos.search', 'Search')}
                />
              </ListActions.Left>
              <ListActions.Right>
                <SplitButton<string>
                  id="repository"
                  dropdownContentClassName="mt-0 min-w-[170px]"
                  handleButtonClick={() => navigate(toCreateRepo?.() || '')}
                  handleOptionChange={option => {
                    if (option === 'import') {
                      navigate(toImportRepo?.() || '')
                    } else if (option === 'import-multiple') {
                      navigate('import-multiple')
                    }
                  }}
                  options={[
                    {
                      value: 'import',
                      label: t('views:repos.import-repository', 'Import Repository')
                    },
                    {
                      value: 'import-multiple',
                      label: t('views:repos.import-repositories', 'Import Repositories')
                    }
                  ]}
                >
                  {t('views:repos.create-repository', 'Create Repository')}
                </SplitButton>
              </ListActions.Right>
            </ListActions.Root>
          </>
        )}
        <Spacer size={5} />
        <RepoList
          repos={repositories || []}
          handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
          isDirtyList={isDirtyList}
          useTranslationStore={useTranslationStore}
          isLoading={isLoading}
          toCreateRepo={toCreateRepo}
          toImportRepo={toImportRepo}
          {...routingProps}
        />
        {!!repositories?.length && <Pagination totalPages={totalPages} currentPage={page} goToPage={setPage} t={t} />}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxRepoListPage }

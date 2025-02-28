import { JetpackLogo, WooCommerceWooLogo } from '@automattic/components';
import { SiteCapabilities } from '@automattic/data-stores';
import { __, _x } from '@wordpress/i18n';
import {
	alignJustify as acitvityLogIcon,
	backup as backupIcon,
	brush as brushIcon,
	chartBar as statsIcon,
	code as codeIcon,
	commentAuthorAvatar as profileIcon,
	commentAuthorName as subscriberIcon,
	download as downloadIcon,
	edit as editIcon,
	globe as domainsIcon,
	help as helpIcon,
	home as dashboardIcon,
	key as keyIcon,
	media as mediaIcon,
	page as pageIcon,
	payment as creditCardIcon,
	people as peopleIcon,
	plugins as pluginsIcon,
	plus as plusIcon,
	postComments as postCommentsIcon,
	reusableBlock as cacheIcon,
	seen as seenIcon,
	settings as settingsIcon,
	tool as toolIcon,
	wordpress as wordpressIcon,
	comment as feedbackIcon,
} from '@wordpress/icons';
import { Command, CommandCallBackParams } from '../use-command-palette';
import { isCustomDomain } from '../utils';
import { useCommandsParams } from './types';
import useCommandNavigation from './use-command-navigation';

enum SiteType {
	ATOMIC = 'atomic',
	SIMPLE = 'simple',
}

interface CapabilityCommand extends Command {
	capability?: string;
	siteType?: SiteType;
	publicOnly?: boolean;
	isCustomDomain?: boolean;
	filterP2?: boolean;
	filterStaging?: boolean;
}

interface CustomWindow {
	commandPaletteConfig?: {
		siteId: string;
		isAdmin: boolean;
		isAtomic: boolean;
		isStaging: boolean;
		isSelfHosted: boolean;
		isSimple: boolean;
		isPrivate: boolean;
		isComingSoon: boolean;
		isP2: boolean;
		capabilities: {
			[ key: string ]: string;
		};
		isWpcomStore: boolean;
		shouldUseWpAdmin: boolean;
		siteHostname: string;
	};
}

const waitForElementAndClick = ( selector: string, attempt = 1 ) => {
	const element = document.querySelector< HTMLElement >( selector );
	if ( element ) {
		element.click();
	} else if ( attempt <= 5 ) {
		// Try again in 250ms, but no more than 5 times.
		setTimeout( () => waitForElementAndClick( selector, attempt + 1 ), 250 );
	}
};

const useSingleSiteCommands = ( { navigate, currentRoute }: useCommandsParams ): Command[] => {
	const commandNavigation = useCommandNavigation( { navigate, currentRoute } );
	const customWindow = window as CustomWindow | undefined;
	const {
		isAtomic = false,
		isStaging = false,
		isSelfHosted = false,
		isSimple = false,
		isPrivate = false,
		isComingSoon = false,
		capabilities = {},
		isP2 = false,
		isWpcomStore = false,
		shouldUseWpAdmin = false,
		siteHostname,
	} = customWindow?.commandPaletteConfig || {};

	let siteType: SiteType | null = null;
	if ( isAtomic && ! isSelfHosted ) {
		siteType = SiteType.ATOMIC;
	}

	if ( isSimple ) {
		siteType = SiteType.SIMPLE;
	}

	const commands: CapabilityCommand[] = [
		{
			name: 'viewMySites',
			label: __( 'View my sites', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'view my sites', 'Keyword for the View my sites command', __i18n_text_domain__ ),
				_x( 'manage sites', 'Keyword for the View my sites command', __i18n_text_domain__ ),
				_x( 'sites dashboard', 'Keyword for the View my sites command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( 'https://wordpress.com/sites' ),
			icon: wordpressIcon,
		},
		{
			name: 'getHelp',
			label: __( 'Get help', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'get help', 'Keyword for the Get help command', __i18n_text_domain__ ),
				_x( 'contact support', 'Keyword for the Get help command', __i18n_text_domain__ ),
				_x( 'help center', 'Keyword for the Get help command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: ( { close }: CommandCallBackParams ) => {
				close();
				waitForElementAndClick( '#wp-admin-bar-help-center' );
			},
			icon: helpIcon,
		},
		{
			name: 'clearCache',
			label: __( 'Clear cache', __i18n_text_domain__ ),
			callback: commandNavigation( '/hosting-config/:site#cache' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: cacheIcon,
		},
		{
			name: 'enableEdgeCache',
			label: __( 'Enable edge cache', __i18n_text_domain__ ),
			callback: commandNavigation( '/hosting-config/:site#edge' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			publicOnly: true,
			icon: cacheIcon,
		},
		{
			name: 'disableEdgeCache',
			label: __( 'Disable edge cache', __i18n_text_domain__ ),
			callback: commandNavigation( '/hosting-config/:site#edge' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			publicOnly: true,
			icon: cacheIcon,
		},
		{
			name: 'manageCacheSettings',
			label: __( 'Manage cache settings', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'manage cache settings',
					'Keyword for the Manage cache settings command',
					__i18n_text_domain__
				),
				_x( 'clear cache', 'Keyword for the Manage cache settings command', __i18n_text_domain__ ),
				_x(
					'disable cache',
					'Keyword for the Manage cache settings command',
					__i18n_text_domain__
				),
				_x( 'enable cache', 'Keyword for the Manage cache settings command', __i18n_text_domain__ ),
				_x(
					'global edge cache',
					'Keyword for the Manage cache settings command',
					__i18n_text_domain__
				),
				_x( 'purge cache', 'Keyword for the Manage cache settings command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/hosting-config/:site#cache' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: cacheIcon,
		},
		{
			name: 'visitSite',
			label: __( 'Visit site homepage', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'visit site homepage',
					'Keyword for the Visit site dashboard command',
					__i18n_text_domain__
				),
				_x( 'visit site', 'Keyword for the Visit site dashboard command', __i18n_text_domain__ ),
				_x( 'see site', 'Keyword for the Visit site dashboard command', __i18n_text_domain__ ),
				_x( 'browse site', 'Keyword for the Visit site dashboard command', __i18n_text_domain__ ),
			].join( ' ' ),
			context: [ '/wp-admin' ],
			callback: commandNavigation( ':site' ),
			icon: seenIcon,
		},
		{
			name: 'openSiteDashboard',
			label: __( 'Open site dashboard', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'open site dashboard',
					'Keyword for the Open site dashboard command',
					__i18n_text_domain__
				),
				_x( 'admin', 'Keyword for the Open site dashboard command', __i18n_text_domain__ ),
				_x( 'wp-admin', 'Keyword for the Open site dashboard command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/wp-admin' ),
			icon: dashboardIcon,
		},
		{
			name: 'openHostingConfiguration',
			label: __( 'Open hosting configuration', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'open hosting configuration',
					'Keyword for the Open hosting configuration command',
					__i18n_text_domain__
				),
				_x(
					'admin interface style',
					'Keyword for the Open hosting configuration command',
					__i18n_text_domain__
				),
				_x( 'cache', 'Keyword for the Open hosting configuration command', __i18n_text_domain__ ),
				_x(
					'database',
					'Keyword for the Open hosting configuration command',
					__i18n_text_domain__
				),
				_x(
					'global edge cache',
					'Keyword for the Open hosting configuration command',
					__i18n_text_domain__
				),
				_x( 'hosting', 'Keyword for the Open hosting configuration command', __i18n_text_domain__ ),
				_x( 'mysql', 'Keyword for the Open hosting configuration command', __i18n_text_domain__ ),
				_x(
					'phpmyadmin',
					'Keyword for the Open hosting configuration command',
					__i18n_text_domain__
				),
				_x(
					'php version',
					'Keyword for the Open hosting configuration command',
					__i18n_text_domain__
				),
				_x(
					'sftp/ssh credentials',
					'Keyword for the Open hosting configuration command',
					__i18n_text_domain__
				),
				_x( 'wp-cli', 'Keyword for the Open hosting configuration command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/hosting-config/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			filterP2: true,
			icon: settingsIcon,
		},
		{
			name: 'openPHPmyAdmin',
			label: __( 'Open database in phpMyAdmin', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'open database in phpmyadmin',
					'Keyword for the Open database in phpMyAdmin command',
					__i18n_text_domain__
				),
				_x(
					'database',
					'Keyword for the Open database in phpMyAdmin command',
					__i18n_text_domain__
				),
				_x( 'mysql', 'Keyword for the Open database in phpMyAdmin command', __i18n_text_domain__ ),
				_x(
					'phpmyadmin',
					'Keyword for the Open database in phpMyAdmin command',
					__i18n_text_domain__
				),
			].join( ' ' ),
			callback: commandNavigation( '/hosting-config/:site#database-access' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: pageIcon,
		},
		{
			name: 'openProfile',
			label: __( 'Open my profile', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'open my profile', 'Keyword for the Open my profile command', __i18n_text_domain__ ),
				_x( 'account', 'Keyword for the Open my profile command', __i18n_text_domain__ ),
				_x( 'display name', 'Keyword for the Open my profile command', __i18n_text_domain__ ),
				_x( 'gravatar', 'Keyword for the Open my profile command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( `/me` ),
			icon: profileIcon,
		},
		{
			name: 'viewDeveloperFeatures',
			label: __( 'View developer features', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'view developer features',
					'Keyword for the View developer features command',
					__i18n_text_domain__
				),
				_x( 'profile', 'Keyword for the View developer features command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( `/me/developer` ),
			icon: codeIcon,
		},
		{
			name: 'openReader',
			label: __( 'Open reader', __i18n_text_domain__ ),
			callback: commandNavigation( `/read` ),
			icon: (
				<svg height="24" viewBox="4 4 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					<clipPath id="a">
						<path d="m4 11.2002h24v10.2857h-24z"></path>
					</clipPath>
					<g clipPath="url(#a)">
						<path d="m4.94437 16.8443-.94437-.0656v-1.4979l1.05696-.0515c.73758-2.4238 2.27248-3.924 4.78852-4.0248 2.48152-.0961 4.13592 1.2541 5.05502 3.6099.3317-.1946.7077-.297 1.0903-.297s.7586.1024 1.0903.297c.9604-2.3863 2.6355-3.7505 5.1722-3.6005 2.4632.1406 3.9591 1.6408 4.6828 4.0177l1.057.0492v1.444c-.0528.0304-.0873.0726-.1149.0679-.6893-.1054-.9007.211-1.0615.8861-.586 2.4589-2.7872 3.9732-5.3538 3.7927-2.2977-.1618-4.2302-2.1097-4.5381-4.5475-.0359-.2323-.1505-.4444-.3239-.5995-.1734-.155-.3945-.2431-.625-.249-.2239.01-.4376.0984-.6051.2505-.1674.152-.2783.3582-.314.5839-.3332 2.5785-2.3506 4.4983-4.8115 4.5756-2.60796.0821-4.67824-1.608-5.20213-4.245-.01149-.1313-.05974-.2509-.0988-.3962zm5.05505 3.0942c.93708.0075 1.83898-.3643 2.50778-1.034.6689-.6696 1.0503-1.5824 1.0606-2.5384.0049-.9553-.3621-1.8736-1.0204-2.5531s-1.5541-1.0646-2.4905-1.0708c-.93734-.0075-1.83926.3647-2.50784 1.0349s-1.04921 1.5836-1.05831 2.5398c-.00302.4737.08568.9433.261 1.382.17532.4386.43381.8376.76065 1.1741s.7156.6038 1.14397.7866c.42836.1829.88789.2776 1.35223.2789zm11.96208 0c.9375 0 1.8366-.3798 2.4997-1.0558.6631-.6761 1.0359-1.593 1.0365-2.5494-.0048-.956-.381-1.871-1.046-2.5446-.665-.6735-1.5646-1.0507-2.5017-1.0488-.9374 0-1.8366.3797-2.4997 1.0557-.6631.6761-1.0359 1.5931-1.0365 2.5494.0021.4744.0958.9437.2757 1.3811s.4424.8344.7727 1.1683.7219.5982 1.1523.7777c.4304.1796.8912.2709 1.3562.2687z"></path>
					</g>
				</svg>
			),
		},
		{
			name: 'openJetpackSettings',
			label: __( 'Open Jetpack settings', __i18n_text_domain__ ),
			callback: commandNavigation( `/wp-admin/admin.php?page=jetpack#/settings` ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: <JetpackLogo size={ 18 } />,
		},
		{
			name: 'addJetpack',
			label: __( 'Add Jetpack to a self-hosted site', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'Add Jetpack to a self-hosted site',
					'Keyword for Add Jetpack to a self-hosted site command',
					__i18n_text_domain__
				),
				_x(
					'connect jetpack',
					'Keyword for Add Jetpack to a self-hosted site command',
					__i18n_text_domain__
				),
			].join( ' ' ),
			callback: commandNavigation( `/jetpack/connect?cta_from=command-palette` ),
			icon: <JetpackLogo size={ 18 } />,
		},
		{
			name: 'manageJetpackModules',
			label: __( 'Manage Jetpack modules', __i18n_text_domain__ ),
			callback: commandNavigation( `/wp-admin/admin.php?page=jetpack_modules` ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: <JetpackLogo size={ 18 } />,
		},
		{
			name: 'importSite',
			label: __( 'Import site to WordPress.com', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'Import site to WordPress.com',
					'Keyword for Import site to WordPress.com command',
					__i18n_text_domain__
				),
				_x(
					'migrate site',
					'Keyword for Import site to WordPress.com command',
					__i18n_text_domain__
				),
			].join( ' ' ),
			callback: commandNavigation( `/start/import?ref=command-palette` ),
			icon: downloadIcon,
		},
		{
			name: 'addNewSite',
			label: __( 'Add new site', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'add new site', 'Keyword for the Add new site command', __i18n_text_domain__ ),
				_x( 'create site', 'Keyword for the Add new site command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( 'https://wordpress.com/start/domains?source=command-palette' ),
			icon: plusIcon,
		},
		{
			name: 'openAccountSettings',
			label: __( 'Open account settings', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'open account settings',
					'Keyword for the Open account settings command',
					__i18n_text_domain__
				),
				_x( 'profile', 'Keyword for the Open account settings command', __i18n_text_domain__ ),
				_x( 'email', 'Keyword for the Open account settings command', __i18n_text_domain__ ),
				_x( 'language', 'Keyword for the Open account settings command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( `/me/account` ),
			icon: profileIcon,
		},
		{
			name: 'accessPurchases',
			label: __( 'View my purchases', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'view my purchases',
					'Keyword for the View my purchases command',
					__i18n_text_domain__
				),
				_x( 'manage purchases', 'Keyword for the View my purchases command', __i18n_text_domain__ ),
				_x( 'billing history', 'Keyword for the View my purchases command', __i18n_text_domain__ ),
				_x( 'credit card', 'Keyword for the View my purchases command', __i18n_text_domain__ ),
				_x( 'payment methods', 'Keyword for the View my purchases command', __i18n_text_domain__ ),
				_x( 'subscriptions', 'Keyword for the View my purchases command', __i18n_text_domain__ ),
				_x( 'upgrades', 'Keyword for the View my purchases command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( `/me/purchases` ),
			icon: creditCardIcon,
		},
		{
			name: 'registerDomain',
			label: __( 'Register new domain', __i18n_text_domain__ ),
			callback: commandNavigation( `/start/domain/domain-only?ref=command-palette` ),
			icon: domainsIcon,
		},
		{
			name: 'manageDomains',
			label: __( 'Manage domains', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'manage domains', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'dns', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'domain mapping', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'domain registration', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'domain transfer', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'email forwarding', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'nameservers', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'subdomains', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
				_x( 'whois', 'Keyword for the Manage domains command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( `/domains/manage` ),
			icon: domainsIcon,
		},
		{
			name: 'manageDns',
			label: __( 'Manage DNS records', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'manage dns records',
					'Keyword for the Manage DNS records command',
					__i18n_text_domain__
				),
				_x( 'cname', 'Keyword for the Manage DNS records command', __i18n_text_domain__ ),
				_x( 'mx', 'Keyword for the Manage DNS records command', __i18n_text_domain__ ),
				_x( 'txt', 'Keyword for the Manage DNS records command', __i18n_text_domain__ ),
			].join( ' ' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			isCustomDomain: true,
			callback: commandNavigation( `/domains/manage/:site/dns/:site` ),
			icon: domainsIcon,
		},
		{
			name: 'copySshConnectionString',
			label: __( 'Copy SSH connection string', __i18n_text_domain__ ),
			callback: commandNavigation( '/hosting-config/:site#sftp-credentials' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: keyIcon,
		},
		{
			name: 'openSshCredentials',
			label: __( 'Open SFTP/SSH credentials', __i18n_text_domain__ ),
			callback: commandNavigation( '/hosting-config/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: keyIcon,
		},
		{
			name: 'resetSshSftpPassword',
			label: __( 'Reset SFTP/SSH password', __i18n_text_domain__ ),
			callback: commandNavigation( '/hosting-config/:site#sftp-credentials' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: keyIcon,
		},
		{
			name: 'openJetpackStats',
			label: __( 'Open Jetpack Stats', __i18n_text_domain__ ),
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/admin.php?page=stats' : '/stats/:site'
			),
			icon: statsIcon,
		},
		{
			name: 'openActivityLog',
			label: __( 'Open activity log', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'open activity log',
					'Keyword for the Open activity log command',
					__i18n_text_domain__
				),
				_x(
					'jetpack activity log',
					'Keyword for the Open activity log command',
					__i18n_text_domain__
				),
				_x( 'audit log', 'Keyword for the Open activity log command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation(
				`${
					shouldUseWpAdmin
						? 'https://jetpack.com/redirect/?source=calypso-activity-log&site='
						: '/activity-log/'
				}:site`
			),
			filterP2: true,
			icon: acitvityLogIcon,
		},
		{
			name: 'openJetpackBackup',
			label: __( 'Open Jetpack Backup', __i18n_text_domain__ ),
			callback: commandNavigation(
				`${
					shouldUseWpAdmin
						? 'https://jetpack.com/redirect/?source=calypso-backups&site='
						: '/backup/'
				}:site`
			),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			filterP2: true,
			icon: backupIcon,
		},
		{
			name: 'viewSiteMonitoringMetrics',
			label: __( 'View site monitoring metrics', __i18n_text_domain__ ),
			callback: commandNavigation( '/site-monitoring/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: statsIcon,
		},
		{
			name: 'openGitHubDeployments',
			label: __( 'Open GitHub Deployments' ),
			callback: commandNavigation( '/github-deployments/:site' ),
			searchLabel: [
				_x( 'open github deployments', 'Keyword for the Open GitHub Deployments command' ),
				_x( 'github', 'Keyword for the Open GitHub Deployments command' ),
				_x( 'deployments', 'Keyword for the Open GitHub Deployments command' ),
			].join( ' ' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: (
				<svg
					width={ 18 }
					height={ 18 }
					viewBox="0 0 19 19"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="social-icons--enabled"
				>
					<g clipPath="url(#clip0_2014_1339)">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M9.47169 0C4.23409 0 0 4.26531 0 9.54207C0 13.7601 2.71293 17.3305 6.47648 18.5942C6.94702 18.6892 7.11938 18.3889 7.11938 18.1363C7.11938 17.9151 7.10387 17.1568 7.10387 16.3668C4.46907 16.9356 3.9204 15.2293 3.9204 15.2293C3.49697 14.1234 2.86958 13.8392 2.86958 13.8392C2.00721 13.2546 2.9324 13.2546 2.9324 13.2546C3.88899 13.3178 4.39094 14.2341 4.39094 14.2341C5.2376 15.6874 6.60192 15.2768 7.15079 15.024C7.22911 14.4078 7.48018 13.9813 7.74677 13.7444C5.64533 13.5232 3.43435 12.7017 3.43435 9.03644C3.43435 7.99377 3.81047 7.1407 4.40645 6.47725C4.31242 6.24034 3.98302 5.26067 4.50067 3.94948C4.50067 3.94948 5.30042 3.69666 7.10367 4.92895C7.87571 4.72008 8.6719 4.61382 9.47169 4.61293C10.2714 4.61293 11.0867 4.72363 11.8395 4.92895C13.643 3.69666 14.4427 3.94948 14.4427 3.94948C14.9604 5.26067 14.6308 6.24034 14.5367 6.47725C15.1484 7.1407 15.509 7.99377 15.509 9.03644C15.509 12.7017 13.2981 13.5073 11.1809 13.7444C11.526 14.0445 11.8238 14.6131 11.8238 15.5137C11.8238 16.7933 11.8083 17.8203 11.8083 18.1361C11.8083 18.3889 11.9809 18.6892 12.4512 18.5944C16.2148 17.3303 18.9277 13.7601 18.9277 9.54207C18.9432 4.26531 14.6936 0 9.47169 0Z"
							fill="#24292F"
						/>
					</g>
					<defs>
						<clipPath id="clip0_2014_1339">
							<rect width="19" height="18.6122" fill="white" />
						</clipPath>
					</defs>
				</svg>
			),
		},
		{
			name: 'openPHPLogs',
			label: __( 'Open PHP logs', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'open php logs', 'Keyword for the Open PHP logs command', __i18n_text_domain__ ),
				_x( 'error logs', 'Keyword for the Open PHP logs command', __i18n_text_domain__ ),
				_x( 'fatal errors', 'Keyword for the Open PHP logs command', __i18n_text_domain__ ),
				_x( 'php errors', 'Keyword for the Open PHP logs command', __i18n_text_domain__ ),
				_x( 'php warnings', 'Keyword for the Open PHP logs command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/site-monitoring/:site/php' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: acitvityLogIcon,
		},
		{
			name: 'openWebServerLogs',
			label: __( 'Open web server logs', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'open web server logs',
					'Keyword for the Open web server logs command',
					__i18n_text_domain__
				),
				_x( 'access logs', 'Keyword for the Open web server logs command', __i18n_text_domain__ ),
				_x( 'apache logs', 'Keyword for the Open web server logs command', __i18n_text_domain__ ),
				_x( 'nginx logs', 'Keyword for the Open web server logs command', __i18n_text_domain__ ),
				_x( 'request logs', 'Keyword for the Open web server logs command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/site-monitoring/:site/web' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: acitvityLogIcon,
		},
		{
			name: 'manageStagingSites',
			label: __( 'Manage staging sites', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'manage staging sites',
					'Keyword for the Manage staging sites command',
					__i18n_text_domain__
				),
				_x(
					'add staging site',
					'Keyword for the Manage staging sites command',
					__i18n_text_domain__
				),
				_x(
					'create staging site',
					'Keyword for the Manage staging sites command',
					__i18n_text_domain__
				),
				_x(
					'delete staging site',
					'Keyword for the Manage staging sites command',
					__i18n_text_domain__
				),
				_x(
					'sync staging site',
					'Keyword for the Manage staging sites command',
					__i18n_text_domain__
				),
			].join( ' ' ),
			callback: commandNavigation( '/hosting-config/:site#staging-site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: toolIcon,
		},
		{
			name: 'changePHPVersion',
			label: __( 'Change PHP version', __i18n_text_domain__ ),
			callback: commandNavigation( '/hosting-config/:site#web-server-settings' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: toolIcon,
		},
		{
			name: 'changeAdminInterfaceStyle',
			label: __( 'Change admin interface style', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'change admin interface style',
					'Keyword for the Change admin interface style command',
					__i18n_text_domain__
				),
				_x(
					'wp-admin',
					'Keyword for the Change admin interface style command',
					__i18n_text_domain__
				),
			].join( ' ' ),
			callback: commandNavigation( '/hosting-config/:site#admin-interface-style' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: pageIcon,
		},
		{
			name: 'addNewPost',
			label: __( 'Add new post', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'add new post', 'Keyword for the Add new post command', __i18n_text_domain__ ),
				_x( 'create post', 'Keyword for the Add new post command', __i18n_text_domain__ ),
				_x( 'write post', 'Keyword for the Add new post command', __i18n_text_domain__ ),
			].join( ' ' ),
			context: [ { path: '/wp-admin/edit.php', match: 'exact' } ],
			callback: commandNavigation( shouldUseWpAdmin ? '/wp-admin/post-new.php' : '/post/:site' ),
			capability: SiteCapabilities.EDIT_POSTS,
			icon: plusIcon,
		},
		{
			name: 'managePosts',
			label: __( 'Manage posts', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'manage posts', 'Keyword for the Manage posts command', __i18n_text_domain__ ),
				_x( 'edit posts', 'Keyword for the Manage posts command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( shouldUseWpAdmin ? '/wp-admin/edit.php' : '/posts/:site' ),
			capability: SiteCapabilities.EDIT_POSTS,
			icon: editIcon,
		},
		{
			name: 'viewMediaUploads',
			label: __( 'View media uploads', __i18n_text_domain__ ),
			searchLabel: [
				_x(
					'view media uploads',
					'Keyword for the View media uploads command',
					__i18n_text_domain__
				),
				_x( 'manage uploads', 'Keyword for the View media uploads command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( shouldUseWpAdmin ? '/wp-admin/upload.php' : '/media/:site' ),
			capability: SiteCapabilities.UPLOAD_FILES,
			icon: mediaIcon,
		},
		{
			name: 'uploadMedia',
			label: __( 'Upload media', __i18n_text_domain__ ),
			callback: commandNavigation( shouldUseWpAdmin ? '/wp-admin/media-new.php' : '/media/:site' ),
			capability: SiteCapabilities.UPLOAD_FILES,
			icon: mediaIcon,
		},
		{
			name: 'managePages',
			label: __( 'Manage pages', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'manage pages', 'Keyword for the Manage pages command', __i18n_text_domain__ ),
				_x( 'edit pages', 'Keyword for the Manage pages command', __i18n_text_domain__ ),
				_x( 'delete pages', 'Keyword for the Manage pages command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/edit.php?post_type=page' : '/pages/:site'
			),
			capability: SiteCapabilities.EDIT_PAGES,
			icon: editIcon,
		},
		{
			name: 'addNewPage',
			label: __( 'Add new page', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'add new page', 'Keyword for the Add new page command', __i18n_text_domain__ ),
				_x( 'create page', 'Keyword for the Add new page command', __i18n_text_domain__ ),
				_x( 'write page', 'Keyword for the Add new page command', __i18n_text_domain__ ),
			].join( ' ' ),
			context: [ '/wp-admin/edit.php?post_type=page' ],
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/post-new.php?post_type=page' : '/page/:site'
			),
			capability: SiteCapabilities.EDIT_PAGES,
			icon: plusIcon,
		},
		{
			name: 'manageComments',
			label: __( 'Manage comments', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'manage comments', 'Keyword for the Manage comments command', __i18n_text_domain__ ),
				_x( 'edit comments', 'Keyword for the Manage comments command', __i18n_text_domain__ ),
				_x( 'delete comments', 'Keyword for the Manage comments command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/edit-comments.php' : '/comments/:site'
			),
			capability: SiteCapabilities.MODERATE_COMMENTS,
			icon: postCommentsIcon,
		},
		{
			name: 'manageThemes',
			label: __( 'Manage themes', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'manage themes', 'Keyword for the Manage themes command', __i18n_text_domain__ ),
				_x( 'activate theme', 'Keyword for the Manage themes command', __i18n_text_domain__ ),
				_x( 'install theme', 'Keyword for the Manage themes command', __i18n_text_domain__ ),
				_x( 'delete theme', 'Keyword for the Manage themes command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( shouldUseWpAdmin ? '/wp-admin/themes.php' : '/themes/:site' ),
			capability: SiteCapabilities.EDIT_THEME_OPTIONS,
			filterP2: true,
			icon: brushIcon,
		},
		{
			name: 'installTheme',
			label: __( 'Install theme', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'install theme', 'Keyword for the Install theme command', __i18n_text_domain__ ),
				_x( 'add theme', 'Keyword for the Install theme command', __i18n_text_domain__ ),
				_x( 'upload theme', 'Keyword for the Install theme command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/theme-install.php' : '/themes/:site'
			),
			capability: SiteCapabilities.EDIT_THEME_OPTIONS,
			siteType: SiteType.ATOMIC,
			icon: brushIcon,
		},
		{
			name: 'managePlugins',
			label: __( 'Manage plugins', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'manage plugins', 'Keyword for the Manage plugins command', __i18n_text_domain__ ),
				_x( 'activate plugin', 'Keyword for the Manage plugins command', __i18n_text_domain__ ),
				_x( 'deactivate plugin', 'Keyword for the Manage plugins command', __i18n_text_domain__ ),
				_x( 'install plugin', 'Keyword for the Manage plugins command', __i18n_text_domain__ ),
				_x( 'delete plugin', 'Keyword for the Manage plugins command', __i18n_text_domain__ ),
				_x( 'update plugin', 'Keyword for the Manage plugins command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( shouldUseWpAdmin ? '/wp-admin/plugins.php' : '/plugins/:site' ),
			capability: SiteCapabilities.ACTIVATE_PLUGINS,
			filterP2: true,
			icon: pluginsIcon,
		},
		{
			name: 'installPlugin',
			label: __( 'Install plugin', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'install plugin', 'Keyword for the Install plugin command', __i18n_text_domain__ ),
				_x( 'add plugin', 'Keyword for the Install plugin command', __i18n_text_domain__ ),
				_x( 'upload plugin', 'Keyword for the Install plugin command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/plugin-install.php' : '/plugins/:site'
			),
			capability: SiteCapabilities.ACTIVATE_PLUGINS,
			icon: pluginsIcon,
		},
		{
			name: 'changePlan',
			label: __( 'Change site plan', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'upgrade plan', 'Keyword for the Change site plan command', __i18n_text_domain__ ),
				_x( 'change plan', 'Keyword for the Change site plan command', __i18n_text_domain__ ),
				_x( 'add plan', 'Keyword for the Change site plan command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/plans/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			filterP2: true,
			filterStaging: true,
			icon: creditCardIcon,
		},
		{
			name: 'manageMyPlan',
			label: __( 'Manage site plan', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'upgrade plan', 'Keyword for the Manage site plan command', __i18n_text_domain__ ),
				_x( 'manage plan', 'Keyword for the Manage site plan command', __i18n_text_domain__ ),
				_x( 'plan features', 'Keyword for the Manage site plan command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/plans/my-plan/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			filterP2: true,
			filterStaging: true,
			icon: creditCardIcon,
		},
		{
			name: 'manageUsers',
			label: __( 'Manage users', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'manage users', 'Keyword for the Manage users command', __i18n_text_domain__ ),
				_x( 'add user', 'Keyword for the Manage users command', __i18n_text_domain__ ),
				_x( 'delete user', 'Keyword for the Manage users command', __i18n_text_domain__ ),
				_x( 'edit user', 'Keyword for the Manage users command', __i18n_text_domain__ ),
				_x( 'remove user', 'Keyword for the Manage users command', __i18n_text_domain__ ),
				_x( 'update user', 'Keyword for the Manage users command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/users.php' : '/people/team/:site'
			),
			capability: SiteCapabilities.LIST_USERS,
			icon: peopleIcon,
		},
		{
			name: 'addNewUser',
			label: __( 'Add new user', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'add new user', 'Keyword for the Add new user command', __i18n_text_domain__ ),
				_x( 'create user', 'Keyword for the Add new user command', __i18n_text_domain__ ),
				_x( 'invite user', 'Keyword for the Add new user command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/user-new.php' : '/people/new/:site'
			),
			capability: SiteCapabilities.LIST_USERS,
			icon: peopleIcon,
		},
		{
			name: 'addSubscribers',
			label: __( 'Add subscribers', __i18n_text_domain__ ),
			searchLabel: [
				_x( 'add subscribers', 'Keyword for the Add subscribers command', __i18n_text_domain__ ),
				_x( 'import subscribers', 'Keyword for the Add subscribers command', __i18n_text_domain__ ),
				_x( 'upload subscribers', 'Keyword for the Add subscribers command', __i18n_text_domain__ ),
			].join( ' ' ),
			callback: commandNavigation( '/subscribers/:site#add-subscribers' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: subscriberIcon,
		},
		{
			name: 'manageSubscribers',
			label: __( 'Manage subscribers', __i18n_text_domain__ ),
			callback: commandNavigation( '/subscribers/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: subscriberIcon,
		},
		{
			name: 'downloadSubscribers',
			label: __( 'Download subscribers as CSV', __i18n_text_domain__ ),
			callback: commandNavigation(
				'https://dashboard.wordpress.com/wp-admin/index.php?page=subscribers&blog=:siteId&blog_subscribers=csv&type=all',
				{ openInNewTab: true }
			),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: downloadIcon,
		},
		{
			name: 'import',
			label: __( 'Import content to the site', __i18n_text_domain__ ),
			context: [ { path: '/wp-admin/edit.php', match: 'exact' } ],
			callback: commandNavigation( '/import/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: downloadIcon,
		},
		{
			name: 'openWooCommerceSettings',
			label: __( 'Open WooCommerce settings', __i18n_text_domain__ ),
			callback: isWpcomStore
				? commandNavigation( '/wp-admin/admin.php?page=wc-admin' )
				: commandNavigation( '/woocommerce-installation/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			filterP2: true,
			icon: <WooCommerceWooLogo className="woo-command-palette" />,
		},
		{
			name: 'manageSettingsGeneral',
			label: __( 'Manage general settings', __i18n_text_domain__ ),
			context: [ '/wp-admin/options-' ],
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/options-general.php' : '/settings/general/:site'
			),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: settingsIcon,
		},
		{
			name: 'manageSettingsWriting',
			label: __( 'Manage writing settings', __i18n_text_domain__ ),
			context: [ '/wp-admin/options-' ],
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/options-writing.php' : '/settings/writing/:site'
			),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: settingsIcon,
		},
		{
			name: 'manageSettingsReading',
			label: __( 'Manage reading settings', __i18n_text_domain__ ),
			context: [ '/wp-admin/options-' ],
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/options-reading.php' : '/settings/reading/:site'
			),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: settingsIcon,
		},
		{
			name: 'manageSettingsDiscussion',
			label: __( 'Manage discussion settings', __i18n_text_domain__ ),
			context: [ '/wp-admin/options-' ],
			callback: commandNavigation(
				shouldUseWpAdmin ? '/wp-admin/options-discussion.php' : '/settings/discussion/:site'
			),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: settingsIcon,
		},
		{
			name: 'manageSettingsNewsletter',
			label: __( 'Manage newsletter settings', __i18n_text_domain__ ),
			context: [ '/wp-admin/options-' ],
			callback: commandNavigation(
				shouldUseWpAdmin
					? '/wp-admin/admin.php?page=jetpack#/newsletter'
					: '/settings/newsletter/:site'
			),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: settingsIcon,
		},
		{
			name: 'manageSettingsPodcast',
			label: __( 'Manage podcast settings', __i18n_text_domain__ ),
			context: [ '/wp-admin/options-' ],
			callback: commandNavigation( '/settings/podcasting/:site' ),
			capability: SiteCapabilities.MANAGE_OPTIONS,
			icon: settingsIcon,
		},
		{
			name: 'sendFeedback',
			label: __( 'Send feedback', __i18n_text_domain__ ),
			searchLabel: _x(
				'suggest command',
				'Keyword for the Send feedback command',
				__i18n_text_domain__
			),
			callback: ( { close }: CommandCallBackParams ) => {
				close();
				waitForElementAndClick( '#wp-admin-bar-help-center' );
				waitForElementAndClick( '.help-center-contact-page__button' );
				waitForElementAndClick( '.help-center-contact-page__box.email' );
			},
			icon: feedbackIcon,
		},
	];

	return commands
		.filter( ( command ) => {
			if ( command?.capability && ! capabilities[ command.capability ] ) {
				return false;
			}

			if ( command?.siteType && command.siteType !== siteType ) {
				return false;
			}

			if ( command?.isCustomDomain && ! isCustomDomain( siteHostname ) ) {
				return false;
			}

			if ( command?.publicOnly && ( isPrivate || isComingSoon ) ) {
				return false;
			}

			if ( command?.filterP2 && isP2 ) {
				return false;
			}

			if ( command?.filterStaging && isStaging ) {
				return false;
			}

			return true;
		} )
		.map( ( command ) => ( {
			name: command.name,
			label: command.label,
			searchLabel: command.searchLabel,
			callback: command.callback,
			icon: command.icon,
			context: command.context,
		} ) );
};

export default useSingleSiteCommands;

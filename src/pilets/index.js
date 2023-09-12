/* Customizing Pilet loading
 *
 * This shows a simple strategy to dynamically swap UI elements via url queries.
 * 
 * We use the alt=layout url query to determine which Layout Pilet to load. The Alt
 * pilet will make use of the alt footer pilet instead of the normal OpenEdx Footer
 * component, by defining a different extension slot that the alt-footer can fill. 
 * 
 */

// Layout Pilets that can be switched dynamically based on URL
import RegLayoutPilet from './layout';
import AltLayoutPilet from './altLayout';
import AltFooterPilet from './altFooter';

const queryParams = new URLSearchParams(window.location.search);
const useAlt = queryParams.get("alt")?.split(",");
const LayoutPilet = useAlt && useAlt.indexOf('layout') != -1 ? AltLayoutPilet : RegLayoutPilet;



export const pilets = [LayoutPilet, AltFooterPilet];

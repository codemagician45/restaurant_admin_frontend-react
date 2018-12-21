import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { NavLink } from 'react-router-dom';

/** Import assets */
import './sidebar.css';

class Sidebar extends React.Component {
  render() {
    const props = this.props;

    return (
      <Menu {...props} menuClassName="shadow-sm">
        <ul className="sidebar-menu-container card p-2 list-group list-group-flush text-center d-flex flex-column align-items-start shadow-sm">
          <NavLink
            activeClassName="active"
            to={`/cities?page=1`}
            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column"
          >
            <i className="fa fa-building" />
            <small className=" mt-2">Cities</small>
          </NavLink>
          <NavLink
            activeClassName="active"
            to={'/categories?page=1'}
            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column"
          >
            <i className="fa fa-tags" />
            <small className="mt-2">Categories</small>
          </NavLink>
          <NavLink
            activeClassName="active"
            to={'/restaurants?page=1&perPage=5'}
            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column"
          >
            <i className="fa fa-coffee" />
            <small className="mt-2">Restaurants</small>
          </NavLink>
          <NavLink
            activeClassName="active"
            to={`/menus?page=1`}
            className="px-1 py-3 list-group-item list-group-item-action d-flex flex-column"
          >
            <i className="fa fa-cutlery" />
            <small className="mt-2">Menu</small>
          </NavLink>
          <NavLink
            activeClassName="active"
            to={'/items?page=1'}
            className="px-1 py-3 list-group-item
            list-group-item-action d-flex flex-column"
          >
            <i className="fa fa-th" />
            <small className="mt-2">Items of Menu</small>
          </NavLink>
        </ul>
      </Menu>
    );
  }
}

export default Sidebar;

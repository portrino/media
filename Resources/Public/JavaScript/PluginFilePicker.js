// jshint ;_;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

/**
 * Module: Fab/Media/PluginLinkCreator
 */
define([
	'jquery'
], function($) {

	/**
	 * Extend array capability
	 */
	if (!Array.prototype.each) {
		Array.prototype.each = function (fn, scope) {
			'use strict';
			var i, len;
			for (i = 0, len = this.length; i < len; ++i) {
				if (i in this) {
					fn.call(scope, this[i], i, this);
				}
			}
		};
	}

	/**
	 * Bind handler against RTE image editor buttons in the grid.
	 */
	$(document).on('click', '.dataTable tbody .btn-filePicker', function (e) {
		var identifier = $(this).data('uid');
		var closeWindow = true;
		importElement(identifier, closeWindow);
		e.preventDefault();
	});

	/**
	 * Bind handler against image preview buttons in the grid.
	 */
	$(document).on('click', '.dataTable tbody .preview a', function (e) {
		var identifier = $(this).data('uid');
		var closeWindow = true;
		importElement(identifier, closeWindow);
		e.preventDefault();
	});

	/**
	 * Bind handler against image preview buttons in the grid.
	 */
	$(document).on('click', '.mass-file-picker', function (e) {

		e.preventDefault();
		var objectId, table, type, uidArray, selectedRows, identifier;

		table = 'sys_file';
		type = 'file';
		objectId = getObjectId();

		// Get selected rows
		selectedRows = [];
		$('#content-list')
			.find('.checkbox-row')
			.filter(':checked')
			.each(function (index) {
				identifier = $(this).data('uid');
				if (objectId && parent.window.opener.inline.checkUniqueElement(objectId, table, identifier, type)) {
					selectedRows.push(identifier);
				}
			});

		// Check how many rows were selected.
		if (selectedRows.length === 1) {
			parent.window.opener.inline.importElement(objectId, table, selectedRows[0], type);
		} else if (selectedRows.length > 1) {
			parent.window.opener.inline.importElementMultiple(objectId, table, selectedRows, type);
		}
		window.close();
	});

	/**
	 * Check whether an object Id can be found in the parameterss
	 *
	 * @returns {void}
	 */
	function importElement(identifier, close) {

		var objectId, table, type;

		table = 'sys_file';
		type = 'file';
		objectId = getObjectId();
		if (objectId && parent.window.opener.inline.checkUniqueElement(objectId, table, identifier, type)) {
			parent.window.opener.inline.importElement(objectId, table, identifier, type);

			if (close) {
				window.close();
			}
		}
	}

	/**
	 * Check whether an object Id can be found in the parameters
	 *
	 * @returns {string}
	 */
	function getObjectId() {
		var result;

		result = '';

		var uri = new Uri(window.location.href);
		if (uri.getQueryParamValue('params')) {

			var params = uri.getQueryParamValue('params');

			var paramsParts = params.split('|');
			$.each(paramsParts, function (index, paramsPart) {

				var regularExpression = new RegExp(/^data-/g);

				if (regularExpression.test(paramsPart)) {
					result = paramsPart;
				}
			});
		}
		return result;
	}
});

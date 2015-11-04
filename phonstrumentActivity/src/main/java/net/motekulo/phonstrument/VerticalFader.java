package net.motekulo.phonstrument;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.os.Bundle;
import android.os.Parcelable;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

/**
 * Displays a vertically oriented fader
 *  
 * @author dcrowdy
 *
 */

public class VerticalFader extends View{
	interface VerticalFaderPositionListener {
		void onPositionChange(View view, int newPosition);
	}

	private static final String APP_NAME = "VerticalFader";

	private static final int MGREY = 0xff4c494f;
	private static final int MOFFWHITE = 0xffd7d7db;
	private static final int MLIGHTBLUE = 0xff00d4d9;
	private static final int MTURQ = 0xff039599;
	private static final int MBLUE = 0xff003d4e;
	private static final int MRED = 0xffc8001a;

	private static final int PADDING = 16;  // pixel width on either side of the fader

	//private Drawable mSlider;
	//private Drawable mKnob;
	private int height;
	private int width;
	private float mKnobPosition;  // Assuming a value between 0 and 100 for the moment
	private VerticalFaderPositionListener mPositionListener;
	private ShapeDrawable faderOutline;

	private ShapeDrawable faderKnob;

	public VerticalFader(Context context) {
		super(context);
		initView(context);
	}

	public VerticalFader(Context context, AttributeSet attrs) {
		super(context, attrs);
		initView(context);
	}

	public VerticalFader(Context context, AttributeSet attrs, int defStyle) {
		super(context, attrs, defStyle);
		initView(context);
	} 

	private void initView(Context context) {
		final Resources res = context.getResources();
		//mSlider = res.getDrawable(R.drawable.slider_9);
		//mKnob = res.getDrawable(R.drawable.knob_2);

		mKnobPosition = (float)0.25;

		mPositionListener = null;

		float outerRadius = 16;
		float[] outerRadii = new float[] {outerRadius, outerRadius, outerRadius, outerRadius, outerRadius, outerRadius, 
				outerRadius, outerRadius};

		float innerRadius = 8;
		faderOutline = new ShapeDrawable((new RoundRectShape(outerRadii, null, null)));
		faderOutline.getPaint().setColor(MBLUE);

		outerRadius = 8;
		float[] knobRadii = new float[] {outerRadius, outerRadius, outerRadius, outerRadius, outerRadius, outerRadius, 
				outerRadius, outerRadius};

		faderKnob = new ShapeDrawable((new RoundRectShape(knobRadii, null, null)));
		faderKnob.getPaint().setColor(MGREY);

		setOnTouchListener(new OnTouchListener() {
			public boolean onTouch(final View v, final MotionEvent event) {
				int pos;
				pos = (int) (100 - event.getY()/height * 100);
				if (pos <0) {
					pos = 0;
				}
				if (pos > 100) {
					pos = 100;
				}
				setmKnobPosition(pos);
				return true;
			}
		});	
	}

	@Override
	public Parcelable onSaveInstanceState() {

		Bundle bundle = new Bundle();
		bundle.putParcelable("instanceState", super.onSaveInstanceState());
		bundle.putFloat("knobPosition", this.mKnobPosition);

		return bundle;
	}

	@Override
	public void onRestoreInstanceState(Parcelable state) {

		if (state instanceof Bundle) {
			Bundle bundle = (Bundle) state;
			this.mKnobPosition = bundle.getFloat("knobPosition");
			super.onRestoreInstanceState(bundle.getParcelable("instanceState"));
			return;
		}

		super.onRestoreInstanceState(state);
	}


	/**
	 * Sets the listener for the fader
	 * @param listener
	 */
	public void setPositionListener(final VerticalFaderPositionListener listener) {
		mPositionListener = listener;
	}

	/**
	 * Gets the current knob position
	 * @return the position of the fader knob as a float
	 */
	public float getmKnobPosition() {
		return mKnobPosition; // not converting back so probably need to relook at this
	}

	/**
	 * Sets the position of the fader knob 
	 * @param mKnobPosition
	 */
	public void setmKnobPosition(int mKnobPosition) {
		// So this expects a value between 0 and 100
		// And our mKnobPosition is a float from 0 to 1
		this.mKnobPosition = (100 - mKnobPosition)/(float)100;
		if (mKnobPosition > 100) this.mKnobPosition = 0;
		if (mKnobPosition < 0) this.mKnobPosition = 1;

		invalidate();
		if (mPositionListener != null) {
			mPositionListener.onPositionChange(this, mKnobPosition);
		}
	}

	@Override
	protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
		height = View.MeasureSpec.getSize(heightMeasureSpec);
		width = View.MeasureSpec.getSize(widthMeasureSpec);
		// height = width * 4;
		this.setMeasuredDimension(width, height);
		//Log.i(APP_NAME, "height is " + height);
		//Log.i(APP_NAME, "width is " + width);
	}

	@Override
	protected void onSizeChanged(int w, int h, int oldw, int oldh) {
		width = w;
		height = h;

	}


	@Override
	protected void onDraw(final Canvas canvas) {

		faderOutline.setBounds(width/2 - width/4, 0, width/2 + width/4, height);
		faderOutline.draw(canvas);
		faderKnob.setBounds(width/2 - width/4, (int)(height * mKnobPosition), 
				width/2 + width/4, (int)(height * mKnobPosition + height/8));
		faderKnob.draw(canvas);

	}

}
